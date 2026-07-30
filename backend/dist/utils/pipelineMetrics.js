"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineMetrics = void 0;
class PipelineMetrics {
    incomingCount = 0;
    parsedCount = 0;
    dbWriteCount = 0;
    parserErrorsCount = 0;
    droppedLogsCount = 0;
    lastIncomingPerSec = 0;
    lastParsedPerSec = 0;
    lastDbWritesPerSec = 0;
    constructor() {
        setInterval(() => {
            this.lastIncomingPerSec = this.incomingCount;
            this.lastParsedPerSec = this.parsedCount;
            this.lastDbWritesPerSec = this.dbWriteCount;
            this.incomingCount = 0;
            this.parsedCount = 0;
            this.dbWriteCount = 0;
        }, 1000);
    }
    recordIncoming() {
        this.incomingCount++;
    }
    recordParsed() {
        this.parsedCount++;
    }
    recordDbWrite(count) {
        this.dbWriteCount += count;
    }
    recordError() {
        this.parserErrorsCount++;
    }
    recordDrop() {
        this.droppedLogsCount++;
    }
    getMetrics(queueSize) {
        return {
            incomingLogsPerSec: this.lastIncomingPerSec,
            parsedLogsPerSec: this.lastParsedPerSec,
            dbWritesPerSec: this.lastDbWritesPerSec,
            parserErrors: this.parserErrorsCount,
            droppedLogs: this.droppedLogsCount,
            queueSize,
        };
    }
}
exports.pipelineMetrics = new PipelineMetrics();
