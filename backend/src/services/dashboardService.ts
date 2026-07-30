import { prisma } from '../database/prisma';
import { logQueue } from '../collectors/logQueue';

export class DashboardService {
  static async getDashboardMetrics() {
    const totalLogs = await prisma.firewallLog.count();

    const allowedCount = await prisma.firewallLog.count({
      where: { action: { in: ['accept', 'pass'] } },
    });

    const deniedCount = await prisma.firewallLog.count({
      where: { action: { in: ['deny', 'drop', 'close', 'block'] } },
    });

    // Top Source IPs
    const topSrcIpsGroup = await prisma.firewallLog.groupBy({
      by: ['srcip'],
      _count: { srcip: true },
      where: { srcip: { not: null } },
      orderBy: { _count: { srcip: 'desc' } },
      take: 5,
    });

    const topSrcIps = topSrcIpsGroup.map((item) => ({
      ip: item.srcip || 'Unknown',
      count: item._count.srcip,
    }));

    // Top Destination IPs
    const topDstIpsGroup = await prisma.firewallLog.groupBy({
      by: ['dstip'],
      _count: { dstip: true },
      where: { dstip: { not: null } },
      orderBy: { _count: { dstip: 'desc' } },
      take: 5,
    });

    const topDstIps = topDstIpsGroup.map((item) => ({
      ip: item.dstip || 'Unknown',
      count: item._count.dstip,
    }));

    // Top Applications
    const topAppsGroup = await prisma.firewallLog.groupBy({
      by: ['app'],
      _count: { app: true },
      where: { app: { not: null } },
      orderBy: { _count: { app: 'desc' } },
      take: 5,
    });

    const topApps = topAppsGroup.map((item) => ({
      name: item.app || 'Unknown',
      count: item._count.app,
    }));

    // Top Users
    const topUsersGroup = await prisma.firewallLog.groupBy({
      by: ['user'],
      _count: { user: true },
      where: { user: { not: null } },
      orderBy: { _count: { user: 'desc' } },
      take: 5,
    });

    const topUsers = topUsersGroup.map((item) => ({
      username: item.user || 'Anonymous',
      count: item._count.user,
    }));

    // Threat & IPS Events
    const threatEventsCount = await prisma.firewallLog.count({
      where: { OR: [{ type: 'utm' }, { level: { in: ['warning', 'error', 'critical', 'alert'] } }] },
    });

    // Country Distribution
    const topCountriesGroup = await prisma.firewallLog.groupBy({
      by: ['dstcountry'],
      _count: { dstcountry: true },
      where: { dstcountry: { not: null } },
      orderBy: { _count: { dstcountry: 'desc' } },
      take: 5,
    });

    const topCountries = topCountriesGroup.map((item) => ({
      country: item.dstcountry || 'Unknown',
      count: item._count.dstcountry,
    }));

    const queueStats = logQueue.getStats();

    return {
      totalLogs,
      allowedCount,
      deniedCount,
      threatEventsCount,
      topSrcIps,
      topDstIps,
      topApps,
      topUsers,
      topCountries,
      queueStats,
    };
  }
}
