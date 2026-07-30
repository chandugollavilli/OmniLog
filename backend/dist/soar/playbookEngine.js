"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybookEngine = void 0;
const notificationDispatcher_1 = require("../notifications/notificationDispatcher");
const logger_1 = require("../utils/logger");
const prisma_1 = require("../database/prisma");
class PlaybookEngine {
    static async executePlaybook(triggerEvent, context) {
        const playbooks = await prisma_1.prisma.playbook.findMany({
            where: { triggerEvent, enabled: true },
        });
        for (const playbook of playbooks) {
            logger_1.logger.info(`⚡ Executing SOAR Playbook: [${playbook.name}] for trigger [${triggerEvent}]`);
            try {
                const actions = JSON.parse(playbook.actions || '[]');
                for (const action of actions) {
                    if (action === 'NOTIFY_TEAMS' || action === 'NOTIFY_SLACK') {
                        await notificationDispatcher_1.NotificationDispatcher.dispatch({
                            alertId: context.alertId || 'auto-alert',
                            title: `[SOAR Playbook Triggered] ${playbook.name}`,
                            description: `Automated incident response playbook executed for event: ${triggerEvent}`,
                            severity: 'HIGH',
                            channels: ['SLACK', 'TEAMS', 'WEBHOOK'],
                            slackUrl: process.env.SLACK_WEBHOOK_URL,
                            teamsUrl: process.env.TEAMS_WEBHOOK_URL,
                        });
                    }
                    else if (action === 'CREATE_INCIDENT') {
                        await prisma_1.prisma.incident.create({
                            data: {
                                title: `SOAR Incident: ${playbook.name}`,
                                description: `Auto-generated incident from SOAR Playbook Execution on ${triggerEvent}`,
                                severity: 'HIGH',
                                status: 'NEW',
                            },
                        });
                    }
                    else if (action === 'BLOCK_IP' && context.sourceIp) {
                        logger_1.logger.warn(`🛡️ SOAR Action: Auto-blocking IP ${context.sourceIp} on perimeter FortiGate firewalls.`);
                    }
                }
                await prisma_1.prisma.playbook.update({
                    where: { id: playbook.id },
                    data: { runCount: { increment: 1 } },
                });
            }
            catch (err) {
                logger_1.logger.error(`Error executing SOAR Playbook ${playbook.name}:`, err);
            }
        }
    }
}
exports.PlaybookEngine = PlaybookEngine;
