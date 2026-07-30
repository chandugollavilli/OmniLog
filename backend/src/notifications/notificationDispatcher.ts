import { prisma } from '../database/prisma';
import { logger } from '../utils/logger';
import axios from 'axios';

export interface NotificationPayload {
  alertId: string;
  title: string;
  description: string;
  severity: string;
  sourceIp?: string;
  destIp?: string;
  channels: string | string[]; // CSV string or Array: EMAIL, WEBHOOK, SLACK, TEAMS, DISCORD
  webhookUrl?: string;
  slackUrl?: string;
  teamsUrl?: string;
}

export class NotificationDispatcher {
  static async dispatch(payload: NotificationPayload): Promise<void> {
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
        } else if (trimmed === 'TEAMS' && payload.teamsUrl) {
          await this.sendTeams(payload.teamsUrl, payload);
          await this.recordHistory(payload.alertId, 'TEAMS', payload.teamsUrl, 'SENT');
        } else if (trimmed === 'WEBHOOK' && payload.webhookUrl) {
          await this.sendWebhook(payload.webhookUrl, payload);
          await this.recordHistory(payload.alertId, 'WEBHOOK', payload.webhookUrl, 'SENT');
        }
      } catch (err: any) {
        logger.error(`Failed to dispatch notification to ${trimmed}:`, err);
        await this.recordHistory(payload.alertId, trimmed, payload.webhookUrl || payload.slackUrl || 'N/A', 'FAILED', err.message);
      }
    }
  }

  private static async sendSlack(url: string, p: NotificationPayload) {
    await axios.post(url, {
      text: `🚨 *[OmniLog Security Alert]*: *${p.title}* (${p.severity})\n${p.description}\nSource IP: \`${p.sourceIp || 'N/A'}\``,
    });
  }

  private static async sendTeams(url: string, p: NotificationPayload) {
    await axios.post(url, {
      title: `🚨 OmniLog Security Alert: ${p.title}`,
      text: `${p.description}\n\nSeverity: ${p.severity} | Source IP: ${p.sourceIp || 'N/A'}`,
    });
  }

  private static async sendWebhook(url: string, p: NotificationPayload) {
    await axios.post(url, p);
  }

  private static async recordHistory(alertId: string, channel: string, target: string, status: string, error?: string) {
    try {
      await prisma.notificationHistory.create({
        data: {
          alertId,
          channel,
          target,
          status,
          error,
        },
      });
    } catch {
      // Ignore recording failure
    }
  }
}
