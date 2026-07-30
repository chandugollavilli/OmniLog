"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseService = void 0;
const prisma_1 = require("../database/prisma");
class CaseService {
    static async getCases() {
        return prisma_1.prisma.case.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                incident: true,
                analyst: { select: { id: true, username: true, email: true } },
                evidence: true,
                comments: true,
            },
        });
    }
    static async createCase(data) {
        return prisma_1.prisma.case.create({
            data: {
                ...data,
                status: 'OPEN',
            },
        });
    }
    static async addComment(caseId, author, text) {
        return prisma_1.prisma.comment.create({
            data: {
                caseId,
                author,
                text,
            },
        });
    }
}
exports.CaseService = CaseService;
