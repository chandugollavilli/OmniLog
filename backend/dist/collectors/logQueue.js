"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logQueue = void 0;
const prisma_1 = require("../database/prisma");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const socketServer_1 = require("../websocket/socketServer");
const alertEngine_1 = require("../alerts/alertEngine");
class LogQueue {
    queue = [];
    isFlushing = false;
    timer = null;
    totalReceivedCount = 0;
    totalProcessedCount = 0;
    constructor() {
        this.startAutoFlush();
    }
    enqueue(log) {
        this.totalReceivedCount++;
        if (this.queue.length >= env_1.env.SYSLOG_MAX_QUEUE_SIZE) {
            logger_1.logger.warn(`Log queue overflow! Dropping oldest log. Current size: ${this.queue.length}`);
            this.queue.shift();
        }
        this.queue.push(log);
        // Broadcast in real-time to active WebSocket clients
        try {
            (0, socketServer_1.broadcastLog)(log);
        }
        catch (err) {
            // Ignore broadcast errors
        }
        if (this.queue.length >= 500 && !this.isFlushing) {
            this.flush();
        }
    }
    async flush() {
        if (this.isFlushing || this.queue.length === 0)
            return;
        this.isFlushing = true;
        const batch = this.queue.splice(0, 1000);
        try {
            await prisma_1.prisma.firewallLog.createMany({
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
            (0, alertEngine_1.evaluateLogBatch)(batch).catch((err) => logger_1.logger.error('Error in AlertEngine batch processing:', err));
        }
        catch (error) {
            logger_1.logger.error('Failed to bulk insert logs to PostgreSQL:', error);
            // Re-queue failed batch at front if capacity permits
            this.queue.unshift(...batch);
        }
        finally {
            this.isFlushing = false;
        }
    }
    startAutoFlush() {
        this.timer = setInterval(() => {
            this.flush();
        }, env_1.env.SYSLOG_BATCH_FLUSH_MS);
    }
    getStats() {
        return {
            queueLength: this.queue.length,
            totalReceived: this.totalReceivedCount,
            totalProcessed: this.totalProcessedCount,
        };
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
exports.logQueue = new LogQueue();
