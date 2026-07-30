"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../database/prisma");
const password_1 = require("../utils/password");
class UserService {
    static async getUsers() {
        return prisma_1.prisma.user.findMany({
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
    static async createUser(data) {
        const policyCheck = (0, password_1.validatePasswordPolicy)(data.password);
        if (!policyCheck.valid) {
            throw new Error(policyCheck.reason);
        }
        const existing = await prisma_1.prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { username: data.username }] },
        });
        if (existing) {
            throw new Error('User with this email or username already exists.');
        }
        const passwordHash = await (0, password_1.hashPassword)(data.password);
        return prisma_1.prisma.user.create({
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
    static async updateUser(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data,
            select: { id: true, email: true, username: true, role: true, isActive: true },
        });
    }
    static async deleteUser(id) {
        return prisma_1.prisma.user.delete({ where: { id } });
    }
}
exports.UserService = UserService;
