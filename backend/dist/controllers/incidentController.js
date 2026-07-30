"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentController = void 0;
const incidentService_1 = require("../services/incidentService");
class IncidentController {
    static async getIncidents(req, res) {
        try {
            const { status } = req.query;
            const incidents = await incidentService_1.IncidentService.getIncidents(status);
            return res.json(incidents);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async createIncident(req, res) {
        try {
            const incident = await incidentService_1.IncidentService.createIncident(req.body);
            return res.status(201).json(incident);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await incidentService_1.IncidentService.updateIncidentStatus(id, status);
            return res.json(updated);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.IncidentController = IncidentController;
