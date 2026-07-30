"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDispatcher = void 0;
const prisma_1 = require("../database/prisma");
const logger_1 = require("../utils/logger");
const axios_1 = __importDefault(require("axios"));
class NotificationDispatcher {
    static async dispatch(payload) {
        const rawChannels = payload.channels || 'WEBHOOK';
        const channels = Array.isArray(rawChannels)
            ? rawChannels
            : rawChannels.split(',');
        for (const channel of channels) {
            const trimmed = channel.trim().toUpperCase();
            try {
                if (trimmed === 'SLACK' && payload.slackUrl) {
                    await this.sendSlack(payload.slackUrl, payload);
                    await this.recordHistory(payload.alertId, 'SLACK', payload.slackUrl, 'SENT');
                }
                else if (trimmed === 'TEAMS' && payload.teamsUrl) {
                    await this.sendTeams(payload.teamsUrl, payload);
                    await this.recordHistory(payload.alertId, 'TEAMS', payload.teamsUrl, 'SENT');
                }
                else if (trimmed === 'WEBHOOK' && payload.webhookUrl) {
                    await this.sendWebhook(payload.webhookUrl, payload);
                    await this.recordHistory(payload.alertId, 'WEBHOOK', payload.webhookUrl, 'SENT');
                }
            }
            catch (err) {
                logger_1.logger.error(`Failed to dispatch notification to ${trimmed}:`, err);
                await this.recordHistory(payload.alertId, trimmed, payload.webhookUrl || payload.slackUrl || 'N/A', 'FAILED', err.message);
            }
        }
    }
    static async sendSlack(url, p) {
        await axios_1.default.post(url, {
            text: `🚨 *[OmniLog Security Alert]*: *${p.title}* (${p.severity})\n${p.description}\nSource IP: \`${p.sourceIp || 'N/A'}\``,
        });
    }
    static async sendTeams(url, p) {
        await axios_1.default.post(url, {
            title: `🚨 OmniLog Security Alert: ${p.title}`,
            text: `${p.description}\n\nSeverity: ${p.severity} | Source IP: ${p.sourceIp || 'N/A'}`,
        });
    }
    static async sendWebhook(url, p) {
        await axios_1.default.post(url, p);
    }
    static async recordHistory(alertId, channel, target, status, error) {
        try {
            await prisma_1.prisma.notificationHistory.create({
                data: {
                    alertId,
                    channel,
                    target,
                    status,
                    error,
                },
            });
        }
        catch {
            // Ignore recording failure
        }
    }
}
exports.NotificationDispatcher = NotificationDispatcher;
