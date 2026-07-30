"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../database/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const client_1 = require("@prisma/client");
class AuthService {
    static async login(email, password, ipAddress, userAgent) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password.');
        }
        if (!user.isActive) {
            throw new Error('Account disabled. Please contact administrator.');
        }
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error(`Account locked due to multiple failed attempts. Try again after ${user.lockedUntil.toLocaleTimeString()}`);
        }
        const isValid = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!isValid) {
            const failedAttempts = user.failedAttempts + 1;
            let lockedUntil = null;
            if (failedAttempts >= env_1.env.MAX_LOGIN_ATTEMPTS) {
                lockedUntil = new Date(Date.now() + env_1.env.LOCK_TIME_MINUTES * 60 * 1000);
            }
            await prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { failedAttempts, lockedUntil },
            });
            throw new Error('Invalid email or password.');
        }
        // Reset failed attempts upon successful login
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
        });
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        // Save Session
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await prisma_1.prisma.session.create({
            data: {
                userId: user.id,
                refreshToken,
                ipAddress,
                userAgent,
                expiresAt,
            },
        });
        // Record Audit Log
        await prisma_1.prisma.auditLog.create({
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
    static async refresh(refreshToken) {
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const session = await prisma_1.prisma.session.findUnique({ where: { refreshToken } });
        if (!session || session.expiresAt < new Date()) {
            throw new Error('Refresh token invalid or expired.');
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user || !user.isActive) {
            throw new Error('User not authorized.');
        }
        const newPayload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(newPayload);
        return { accessToken };
    }
    static async logout(refreshToken) {
        await prisma_1.prisma.session.deleteMany({ where: { refreshToken } });
    }
    static async registerDefaultAdmin() {
        const count = await prisma_1.prisma.user.count();
        if (count === 0) {
            const defaultPassword = 'AdminPassword123!';
            const passwordHash = await (0, password_1.hashPassword)(defaultPassword);
            await prisma_1.prisma.user.create({
                data: {
                    email: 'admin@omnilog.local',
                    username: 'admin',
                    passwordHash,
                    role: client_1.RoleName.ADMINISTRATOR,
                },
            });
            console.log('Registered default admin account: admin@omnilog.local / AdminPassword123!');
        }
    }
}
exports.AuthService = AuthService;
