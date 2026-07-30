import { prisma } from '../database/prisma';
import { IncidentStatus, AlertSeverity } from '@prisma/client';

export class IncidentService {
  static async getIncidents(status?: IncidentStatus) {
    const where: any = {};
    if (status) where.status = status;

    return prisma.incident.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        cases: true,
        timeline: true,
      },
    });
  }

  static async createIncident(data: {
    title: string;
    description: string;
    severity: AlertSeverity;
    mitreTactic?: string;
    mitreTechnique?: string;
    assignedTo?: string;
  }) {
    const incident = await prisma.incident.create({
      data: {
        ...data,
        status: IncidentStatus.NEW,
      },
    });

    await prisma.timelineEvent.create({
      data: {
        incidentId: incident.id,
        action: 'INCIDENT_CREATED',
        description: `Incident created: ${data.title}`,
      },
    });

    return incident;
  }

  static async updateIncidentStatus(id: string, status: IncidentStatus) {
    const updated = await prisma.incident.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });

    await prisma.timelineEvent.create({
      data: {
        incidentId: id,
        action: 'STATUS_UPDATED',
        description: `Incident status updated to ${status}`,
      },
    });

    return updated;
  }
}
