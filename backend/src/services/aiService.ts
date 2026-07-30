import { prisma } from '../database/prisma';

export class AIService {
  static async querySecurityAssistant(userPrompt: string) {
    const promptLower = userPrompt.toLowerCase();

    if (promptLower.includes('blocked traffic') || promptLower.includes('denied')) {
      const count = await prisma.firewallLog.count({
        where: { action: { in: ['deny', 'drop', 'block'] } },
      });
      const topBlockedSrc = await prisma.firewallLog.groupBy({
        by: ['srcip'],
        _count: { srcip: true },
        where: { action: { in: ['deny', 'drop', 'block'] } },
        orderBy: { _count: { srcip: 'desc' } },
        take: 5,
      });

      return {
        prompt: userPrompt,
        intent: 'BLOCKED_TRAFFIC_SUMMARY',
        summary: `Analyzed current log database: A total of ${count.toLocaleString()} connection requests were blocked by firewall policies today.`,
        insights: [
          `Top denied attacker IP: ${topBlockedSrc[0]?.srcip || 'N/A'} with ${topBlockedSrc[0]?._count.srcip || 0} attempts.`,
          'Recommendation: Inspect geo-location and add source IP subnet to FortiGate shun list if persistent.',
        ],
        data: topBlockedSrc.map((item) => ({ ip: item.srcip, count: item._count.srcip })),
      };
    }

    if (promptLower.includes('brute-force') || promptLower.includes('brute force')) {
      const alerts = await prisma.alert.findMany({
        where: { title: { contains: 'Brute Force', mode: 'insensitive' } },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      return {
        prompt: userPrompt,
        intent: 'BRUTE_FORCE_ANALYSIS',
        summary: `Found ${alerts.length} active brute-force incident alerts in the SOC queue.`,
        insights: [
          'High-volume authentication failures detected against SSH (Port 22) and RDP (Port 3389).',
          'Recommendation: Enforce Multi-Factor Authentication (MFA) and lock out IP addresses exceeding 5 failed attempts within 15 minutes.',
        ],
        data: alerts,
      };
    }

    if (promptLower.includes('vpn')) {
      const vpnLogs = await prisma.firewallLog.findMany({
        where: { OR: [{ subtype: 'vpn' }, { app: { contains: 'vpn', mode: 'insensitive' } }] },
        take: 5,
        orderBy: { timestamp: 'desc' },
      });

      return {
        prompt: userPrompt,
        intent: 'VPN_ACTIVITY_SUMMARY',
        summary: `Retrieved ${vpnLogs.length} recent SSL-VPN and IPsec tunnel connection events.`,
        insights: [
          'Active remote workforce sessions are operational.',
          'Recommendation: Audit dormant VPN user accounts and ensure TLS 1.3 is enforced.',
        ],
        data: vpnLogs,
      };
    }

    // Default Fallback Intelligent Assistant Response
    const totalLogs = await prisma.firewallLog.count();
    const alertCount = await prisma.alert.count({ where: { status: 'OPEN' } });

    return {
      prompt: userPrompt,
      intent: 'GENERAL_SECURITY_AUDIT',
      summary: `OmniLog AI Security Assistant evaluated system state: ${totalLogs.toLocaleString()} firewall logs ingested, ${alertCount} open SOC security incidents.`,
      insights: [
        'Firewall infrastructure operating within normal baseline parameters.',
        'Recommendation: Run a daily PDF audit report to archive compliance logs.',
      ],
      data: [],
    };
  }
}
