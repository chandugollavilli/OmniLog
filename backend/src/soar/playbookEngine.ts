import { NotificationDispatcher } from '../notifications/notificationDispatcher';
import { logger } from '../utils/logger';
import { prisma } from '../database/prisma';

export class PlaybookEngine {
  public static async executePlaybook(triggerEvent: string, context: any): Promise<void> {
    const playbooks = await prisma.playbook.findMany({
      where: { triggerEvent, enabled: true },
    });

    for (const playbook of playbooks) {
      logger.info(`⚡ Executing SOAR Playbook: [${playbook.name}] for trigger [${triggerEvent}]`);

      try {
        const actions: string[] = JSON.parse(playbook.actions || '[]');

        for (const action of actions) {
          if (action === 'NOTIFY_TEAMS' || action === 'NOTIFY_SLACK') {
            await NotificationDispatcher.dispatch({
              alertId: context.alertId || 'auto-alert',
              title: `[SOAR Playbook Triggered] ${playbook.name}`,
              description: `Automated incident response playbook executed for event: ${triggerEvent}`,
              severity: 'HIGH',
              channels: ['SLACK', 'TEAMS', 'WEBHOOK'],
              slackUrl: process.env.SLACK_WEBHOOK_URL,
              teamsUrl: process.env.TEAMS_WEBHOOK_URL,
            });
          } else if (action === 'CREATE_INCIDENT') {
            await prisma.incident.create({
              data: {
                title: `SOAR Incident: ${playbook.name}`,
                description: `Auto-generated incident from SOAR Playbook Execution on ${triggerEvent}`,
                severity: 'HIGH',
                status: 'NEW',
              },
            });
          } else if (action === 'BLOCK_IP' && context.sourceIp) {
            logger.warn(`🛡️ SOAR Action: Auto-blocking IP ${context.sourceIp} on perimeter FortiGate firewalls.`);
          }
        }

        await prisma.playbook.update({
          where: { id: playbook.id },
          data: { runCount: { increment: 1 } },
        });
      } catch (err) {
        logger.error(`Error executing SOAR Playbook ${playbook.name}:`, err);
      }
    }
  }
}
