"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinuxCollector = void 0;
const CollectorInterface_1 = require("../base/CollectorInterface");
const logQueue_1 = require("../logQueue");
class LinuxCollector extends CollectorInterface_1.BaseCollector {
    name = 'Linux Syslog / Journald Collector';
    vendor = 'linux';
    async receive(rawMessage, metadata) {
        const parsed = this.parse(rawMessage);
        const normalized = this.normalize(parsed, rawMessage);
        logQueue_1.logQueue.enqueue(normalized);
    }
    parse(rawMessage) {
        return {
            timestamp: new Date(),
            devname: 'Linux-Server',
            type: 'syslog',
            raw: rawMessage,
        };
    }
    normalize(parsed, rawMessage) {
        return {
            vendor: this.vendor,
            timestamp: parsed.timestamp,
            devname: parsed.devname,
            type: parsed.type,
            raw: rawMessage,
        };
    }
    async store(batch) { }
}
exports.LinuxCollector = LinuxCollector;
