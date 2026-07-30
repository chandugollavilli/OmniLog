import { prisma } from '../database/prisma';
import { ParsedFortiGateLog } from '../parsers/fortigateParser';
import { logger } from '../utils/logger';
import { broadcastAlert } from '../websocket/socketServer';
import { AlertSeverity } from '@prisma/client';

export async function evaluateLogBatch(batch: ParsedFortiGateLog[]): Promise<void> {
  if (!batch || batch.length === 0) return;

  // Group logs by srcip for pattern detection
  const logsBySrcIp: Record<string, ParsedFortiGateLog[]> = {};

  for (const log of batch) {
    if (log.srcip) {
      if (!logsBySrcIp[log.srcip]) logsBySrcIp[log.srcip] = [];
      logsBySrcIp[log.srcip].push(log);
    }

    // Direct UTM/Malware Detection Alert
    if (log.type === 'utm' || log.subtype === 'virus' || log.level === 'critical' || log.level === 'alert') {
      await createSecurityAlert({
        title: `UTM Threat Event Detected: ${log.subtype || 'Malware'}`,
        description: `Security threat triggered from ${log.srcip || 'Unknown'} to ${log.dstip || 'Unknown'}. App: ${log.app || 'N/A'}. Msg: ${log.msg || 'Threat detected'}`,
        severity: AlertSeverity.CRITICAL,
        sourceIp: log.srcip,
        destIp: log.dstip,
        details: JSON.stringify(log),
      });
    }

    // Direct SSH / RDP Attack Alert
    if ((log.dstport === 22 || log.dstport === 3389) && log.action === 'deny') {
      await createSecurityAlert({
        title: `Denied ${log.dstport === 22 ? 'SSH' : 'RDP'} Access Attempt`,
        description: `Unauthorized remote access attempt blocked from ${log.srcip || 'Unknown'} to ${log.dstip}:${log.dstport}.`,
        severity: AlertSeverity.HIGH,
        sourceIp: log.srcip,
        destIp: log.dstip,
        details: JSON.stringify(log),
      });
    }
  }

  // Evaluate aggregations by Source IP
  for (const [srcip, logs] of Object.entries(logsBySrcIp)) {
    const deniedLogs = logs.filter((l) => l.action === 'deny' || l.action === 'drop' || l.action === 'block');

    // 1. Port Scan Detection (Accessing multiple distinct destination ports)
    const distinctPorts = new Set(deniedLogs.map((l) => l.dstport).filter(Boolean));
    if (distinctPorts.size >= 5) {
      await createSecurityAlert({
        title: `Potential Port Scan Activity Detected`,
        description: `Source IP ${srcip} probed ${distinctPorts.size} distinct ports with denied status within recent batch window.`,
        severity: AlertSeverity.HIGH,
        sourceIp: srcip,
        details: JSON.stringify({ srcip, distinctPorts: Array.from(distinctPorts), totalLogs: logs.length }),
      });
    }

    // 2. Brute Force Attempt (High volume of denied logs from same IP)
    if (deniedLogs.length >= 20) {
      await createSecurityAlert({
        title: `Brute Force / High-Volume Denied Traffic`,
        description: `Source IP ${srcip} generated ${deniedLogs.length} blocked connection requests within short duration.`,
        severity: AlertSeverity.HIGH,
        sourceIp: srcip,
        details: JSON.stringify({ srcip, deniedCount: deniedLogs.length }),
      });
    }
  }
}

interface CreateAlertParams {
  title: string;
  description: string;
  severity: AlertSeverity;
  sourceIp?: string;
  destIp?: string;
  details?: string;
}

async function createSecurityAlert(params: CreateAlertParams): Promise<void> {
  try {
    const newAlert = await prisma.alert.create({
      data: {
        title: params.title,
        description: params.description,
        severity: params.severity,
        status: 'OPEN',
        sourceIp: params.sourceIp,
        destIp: params.destIp,
        details: params.details,
      },
    });

    logger.info(`🚨 Security Alert Triggered: [${params.severity}] ${params.title}`);
    broadcastAlert(newAlert);
  } catch (error) {
    logger.error('Failed to create security alert in DB:', error);
  }
}
