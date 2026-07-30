"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentService = void 0;
const prisma_1 = require("../database/prisma");
const client_1 = require("@prisma/client");
class IncidentService {
    static async getIncidents(status) {
        const where = {};
        if (status)
            where.status = status;
        return prisma_1.prisma.incident.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                cases: true,
                timeline: true,
            },
        });
    }
    static async createIncident(data) {
        const incident = await prisma_1.prisma.incident.create({
            data: {
                ...data,
                status: client_1.IncidentStatus.NEW,
            },
        });
        await prisma_1.prisma.timelineEvent.create({
            data: {
                incidentId: incident.id,
                action: 'INCIDENT_CREATED',
                description: `Incident created: ${data.title}`,
            },
        });
        return incident;
    }
    static async updateIncidentStatus(id, status) {
        const updated = await prisma_1.prisma.incident.update({
            where: { id },
            data: { status, updatedAt: new Date() },
        });
        await prisma_1.prisma.timelineEvent.create({
            data: {
                incidentId: id,
                action: 'STATUS_UPDATED',
                description: `Incident status updated to ${status}`,
            },
        });
        return updated;
    }
}
exports.IncidentService = IncidentService;
