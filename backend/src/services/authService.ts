import { prisma } from '../database/prisma';
import { comparePassword, hashPassword, validatePasswordPolicy } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { env } from '../config/env';
import { RoleName } from '@prisma/client';

export class AuthService {
  static async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new Error('Account disabled. Please contact administrator.');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error(`Account locked due to multiple failed attempts. Try again after ${user.lockedUntil.toLocaleTimeString()}`);
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      const failedAttempts = user.failedAttempts + 1;
      let lockedUntil: Date | null = null;

      if (failedAttempts >= env.MAX_LOGIN_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + env.LOCK_TIME_MINUTES * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts, lockedUntil },
      });

      throw new Error('Invalid email or password.');
    }

    // Reset failed attempts upon successful login
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save Session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        ipAddress,
        details: `User ${user.email} logged in successfully.`,
      },
    });

    return {
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const session = await prisma.session.findUnique({ where: { refreshToken } });

    if (!session || session.expiresAt < new Date()) {
      throw new Error('Refresh token invalid or expired.');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) {
      throw new Error('User not authorized.');
    }

    const newPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(newPayload);

    return { accessToken };
  }

  static async logout(refreshToken: string) {
    await prisma.session.deleteMany({ where: { refreshToken } });
  }

  static async registerDefaultAdmin() {
    const count = await prisma.user.count();
    if (count === 0) {
      const defaultPassword = 'AdminPassword123!';
      const passwordHash = await hashPassword(defaultPassword);
      await prisma.user.create({
        data: {
          email: 'admin@omnilog.local',
          username: 'admin',
          passwordHash,
          role: RoleName.ADMINISTRATOR,
        },
      });
      console.log('Registered default admin account: admin@omnilog.local / AdminPassword123!');
    }
  }
}
