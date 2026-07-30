"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogController = void 0;
const logService_1 = require("../services/logService");
class LogController {
    static async getLogs(req, res) {
        try {
            const { page, limit, ip, user, country, app, policyid, proto, level, action, devname, service, startDate, endDate, search, } = req.query;
            const result = await logService_1.LogService.getLogs({
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : 50,
                ip: ip,
                user: user,
                country: country,
                app: app,
                policyid: policyid ? parseInt(policyid, 10) : undefined,
                proto: proto ? parseInt(proto, 10) : undefined,
                level: level,
                action: action,
                devname: devname,
                service: service,
                startDate: startDate,
                endDate: endDate,
                search: search,
            });
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async getLogById(req, res) {
        try {
            const { id } = req.params;
            const log = await logService_1.LogService.getLogById(id);
            if (!log) {
                return res.status(404).json({ error: 'Log entry not found.' });
            }
            return res.json(log);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.LogController = LogController;
