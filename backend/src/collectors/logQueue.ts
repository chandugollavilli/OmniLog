import { prisma } from '../database/prisma';
import { ParsedFortiGateLog } from '../parsers/fortigateParser';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { broadcastLog } from '../websocket/socketServer';
import { evaluateLogBatch } from '../alerts/alertEngine';

class LogQueue {
  private queue: ParsedFortiGateLog[] = [];
  private isFlushing = false;
  private timer: NodeJS.Timeout | null = null;
  private totalReceivedCount = 0;
  private totalProcessedCount = 0;

  constructor() {
    this.startAutoFlush();
  }

  public enqueue(log: ParsedFortiGateLog): void {
    this.totalReceivedCount++;
    if (this.queue.length >= env.SYSLOG_MAX_QUEUE_SIZE) {
      logger.warn(`Log queue overflow! Dropping oldest log. Current size: ${this.queue.length}`);
      this.queue.shift();
    }
    this.queue.push(log);

    // Broadcast in real-time to active WebSocket clients
    try {
      broadcastLog(log);
    } catch (err) {
      // Ignore broadcast errors
    }

    if (this.queue.length >= 500 && !this.isFlushing) {
      this.flush();
    }
  }

  public async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) return;

    this.isFlushing = true;
    const batch = this.queue.splice(0, 1000);

    try {
      await prisma.firewallLog.createMany({
        data: batch.map((item) => ({
          timestamp: item.timestamp,
          devname: item.devname,
          devid: item.devid,
          logid: item.logid,
          type: item.type,
          subtype: item.subtype,
          level: item.level,
          vd: item.vd,
          srcip: item.srcip,
          dstip: item.dstip,
          srcport: item.srcport,
          dstport: item.dstport,
          proto: item.proto,
          action: item.action,
          policyid: item.policyid,
          polname: item.polname,
          user: item.user,
          srcintf: item.srcintf,
          dstintf: item.dstintf,
          sentbyte: item.sentbyte,
          rcvdbyte: item.rcvdbyte,
          duration: item.duration,
          app: item.app,
          service: item.service,
          sessionid: item.sessionid,
          tranip: item.tranip,
          trport: item.trport,
          srccountry: item.srccountry,
          dstcountry: item.dstcountry,
          msg: item.msg,
          raw: item.raw,
        })),
        skipDuplicates: true,
      });

      this.totalProcessedCount += batch.length;

      // Asynchronously trigger alert engine processing
      evaluateLogBatch(batch).catch((err) =>
        logger.error('Error in AlertEngine batch processing:', err)
      );
    } catch (error) {
      logger.error('Failed to bulk insert logs to PostgreSQL:', error);
      // Re-queue failed batch at front if capacity permits
      this.queue.unshift(...batch);
    } finally {
      this.isFlushing = false;
    }
  }

  private startAutoFlush(): void {
    this.timer = setInterval(() => {
      this.flush();
    }, env.SYSLOG_BATCH_FLUSH_MS);
  }

  public getStats() {
    return {
      queueLength: this.queue.length,
      totalReceived: this.totalReceivedCount,
      totalProcessed: this.totalProcessedCount,
    };
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

export const logQueue = new LogQueue();
