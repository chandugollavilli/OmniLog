"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaloAltoCollector = void 0;
const CollectorInterface_1 = require("../base/CollectorInterface");
const logQueue_1 = require("../logQueue");
class PaloAltoCollector extends CollectorInterface_1.BaseCollector {
    name = 'Palo Alto Networks Collector';
    vendor = 'paloalto';
    async receive(rawMessage, metadata) {
        const parsed = this.parse(rawMessage);
        const normalized = this.normalize(parsed, rawMessage);
        logQueue_1.logQueue.enqueue(normalized);
    }
    parse(rawMessage) {
        // Palo Alto CSV Syslog Format parsing
        const parts = rawMessage.split(',');
        return {
            timestamp: parts[1] ? new Date(parts[1]) : new Date(),
            devname: parts[3] || 'PaloAlto-FW',
            type: parts[4] || 'TRAFFIC',
            srcip: parts[7],
            dstip: parts[8],
            srcport: parts[10] ? parseInt(parts[10], 10) : undefined,
            dstport: parts[11] ? parseInt(parts[11], 10) : undefined,
            action: parts[14] || 'allow',
            app: parts[15],
            user: parts[12],
        };
    }
    normalize(parsed, rawMessage) {
        return {
            vendor: this.vendor,
            timestamp: parsed.timestamp,
            devname: parsed.devname,
            type: parsed.type,
            srcip: parsed.srcip,
            dstip: parsed.dstip,
            srcport: parsed.srcport,
            dstport: parsed.dstport,
            action: parsed.action,
            app: parsed.app,
            user: parsed.user,
            raw: rawMessage,
        };
    }
    async store(batch) { }
}
exports.PaloAltoCollector = PaloAltoCollector;
