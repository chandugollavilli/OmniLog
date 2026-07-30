"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertController = void 0;
const alertService_1 = require("../services/alertService");
class AlertController {
    static async getAlerts(req, res) {
        try {
            const { status, severity } = req.query;
            const alerts = await alertService_1.AlertService.getAlerts(status, severity);
            return res.json(alerts);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async updateAlertStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await alertService_1.AlertService.updateAlertStatus(id, status);
            return res.json(updated);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getAlertRules(req, res) {
        try {
            const rules = await alertService_1.AlertService.getAlertRules();
            return res.json(rules);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async createAlertRule(req, res) {
        try {
            const rule = await alertService_1.AlertService.createAlertRule(req.body);
            return res.status(201).json(rule);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async deleteAlertRule(req, res) {
        try {
            const { id } = req.params;
            await alertService_1.AlertService.deleteAlertRule(id);
            return res.json({ message: 'Alert rule removed.' });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.AlertController = AlertController;
