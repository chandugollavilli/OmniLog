import { prisma } from '../database/prisma';

export class UserRepository {
  static async findAll(organizationId?: string) {
    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        organizationId: true,
        siteId: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async create(data: any) {
    return prisma.user.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
