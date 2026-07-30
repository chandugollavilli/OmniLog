"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const prisma_1 = require("../database/prisma");
const reportGenerator_1 = require("../reports/reportGenerator");
class ReportService {
    static async getReports() {
        return prisma_1.prisma.report.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    static async generateReport(title, type, format, startDate, endDate, userId) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (0, reportGenerator_1.createReport)(title, type, format, start, end, userId);
    }
}
exports.ReportService = ReportService;
