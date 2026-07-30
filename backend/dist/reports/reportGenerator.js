"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReport = createReport;
const prisma_1 = require("../database/prisma");
const csvReport_1 = require("./csvReport");
const pdfReport_1 = require("./pdfReport");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function createReport(title, type, format, startDate, endDate, generatedBy) {
    const logs = await prisma_1.prisma.firewallLog.findMany({
        where: {
            timestamp: {
                gte: startDate,
                lte: endDate,
            },
        },
        take: 5000,
        orderBy: { timestamp: 'desc' },
    });
    const totalLogs = logs.length;
    const allowedLogs = logs.filter((l) => l.action === 'accept' || l.action === 'pass').length;
    const deniedLogs = logs.filter((l) => l.action === 'deny' || l.action === 'drop' || l.action === 'close').length;
    let totalBytesNum = 0n;
    const srcIpMap = {};
    const polMap = {};
    for (const log of logs) {
        if (log.sentbyte)
            totalBytesNum += log.sentbyte;
        if (log.rcvdbyte)
            totalBytesNum += log.rcvdbyte;
        if (log.srcip) {
            srcIpMap[log.srcip] = (srcIpMap[log.srcip] || 0) + 1;
        }
        const polName = log.polname || 'Default';
        polMap[polName] = (polMap[polName] || 0) + 1;
    }
    const topAttackers = Object.entries(srcIpMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([srcip, count]) => ({ srcip, count }));
    const topPolicies = Object.entries(polMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([polname, count]) => ({ polname, count }));
    const totalBytesFormatted = (Number(totalBytesNum) / (1024 * 1024)).toFixed(2) + ' MB';
    const reportsDir = path_1.default.resolve(__dirname, '../../uploads/reports');
    if (!fs_1.default.existsSync(reportsDir)) {
        fs_1.default.mkdirSync(reportsDir, { recursive: true });
    }
    const filename = `report_${Date.now()}.${format.toLowerCase()}`;
    const filePath = path_1.default.join(reportsDir, filename);
    if (format === 'CSV') {
        const csvContent = (0, csvReport_1.generateCSVReport)(logs);
        fs_1.default.writeFileSync(filePath, csvContent);
    }
    else {
        const pdfBuffer = await (0, pdfReport_1.generatePDFReport)(title, { totalLogs, allowedLogs, deniedLogs, totalBytes: totalBytesFormatted }, topAttackers, topPolicies);
        fs_1.default.writeFileSync(filePath, pdfBuffer);
    }
    const fileUrl = `/uploads/reports/${filename}`;
    const reportRecord = await prisma_1.prisma.report.create({
        data: {
            title,
            type,
            startDate,
            endDate,
            fileUrl,
            format,
            generatedBy,
        },
    });
    return reportRecord;
}
