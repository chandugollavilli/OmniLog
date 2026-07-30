"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
class DashboardController {
    static async getDashboardMetrics(req, res) {
        try {
            const metrics = await dashboardService_1.DashboardService.getDashboardMetrics();
            return res.json(metrics);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.DashboardController = DashboardController;
