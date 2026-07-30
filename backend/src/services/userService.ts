import { prisma } from '../database/prisma';
import { hashPassword, validatePasswordPolicy } from '../utils/password';
import { RoleName } from '@prisma/client';

export class UserService {
  static async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createUser(data: { email: string; username: string; password: string; role: RoleName }) {
    const policyCheck = validatePasswordPolicy(data.password);
    if (!policyCheck.valid) {
      throw new Error(policyCheck.reason);
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
    });
    if (existing) {
      throw new Error('User with this email or username already exists.');
    }

    const passwordHash = await hashPassword(data.password);
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  static async updateUser(id: string, data: { email?: string; role?: RoleName; isActive?: boolean }) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, username: true, role: true, isActive: true },
    });
  }

  static async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
