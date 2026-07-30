import { prisma } from '../database/prisma';

export class CaseService {
  static async getCases() {
    return prisma.case.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        incident: true,
        analyst: { select: { id: true, username: true, email: true } },
        evidence: true,
        comments: true,
      },
    });
  }

  static async createCase(data: {
    incidentId: string;
    title: string;
    description?: string;
    priority?: string;
    analystId?: string;
    slaMinutes?: number;
    tags?: string;
  }) {
    return prisma.case.create({
      data: {
        ...data,
        status: 'OPEN',
      },
    });
  }

  static async addComment(caseId: string, author: string, text: string) {
    return prisma.comment.create({
      data: {
        caseId,
        author,
        text,
      },
    });
  }
}
