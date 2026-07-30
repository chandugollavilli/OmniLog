"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const auditService_1 = require("../services/auditService");
class AuditController {
    static async getAuditLogs(req, res) {
        try {
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
            const result = await auditService_1.AuditService.getAuditLogs(page, limit);
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.AuditController = AuditController;
