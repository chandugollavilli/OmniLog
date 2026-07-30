"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../database/prisma");
class UserRepository {
    static async findAll(organizationId) {
        const where = {};
        if (organizationId)
            where.organizationId = organizationId;
        return prisma_1.prisma.user.findMany({
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
    static async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    static async findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    }
    static async create(data) {
        return prisma_1.prisma.user.create({ data });
    }
    static async update(id, data) {
        return prisma_1.prisma.user.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma_1.prisma.user.delete({ where: { id } });
    }
}
exports.UserRepository = UserRepository;
