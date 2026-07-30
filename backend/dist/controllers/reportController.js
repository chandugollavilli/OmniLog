"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const reportService_1 = require("../services/reportService");
class ReportController {
    static async getReports(req, res) {
        try {
            const reports = await reportService_1.ReportService.getReports();
            return res.json(reports);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async generateReport(req, res) {
        try {
            const { title, type, format, startDate, endDate } = req.body;
            const userId = req.user?.userId;
            const report = await reportService_1.ReportService.generateReport(title || 'Security Log Audit Report', type || 'DAILY', format || 'PDF', startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), endDate || new Date().toISOString(), userId);
            return res.status(201).json(report);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.ReportController = ReportController;
