"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CiscoCollector = void 0;
const CollectorInterface_1 = require("../base/CollectorInterface");
const logQueue_1 = require("../logQueue");
class CiscoCollector extends CollectorInterface_1.BaseCollector {
    name = 'Cisco ASA / Firepower Collector';
    vendor = 'cisco';
    async receive(rawMessage, metadata) {
        const parsed = this.parse(rawMessage);
        const normalized = this.normalize(parsed, rawMessage);
        logQueue_1.logQueue.enqueue(normalized);
    }
    parse(rawMessage) {
        return {
            timestamp: new Date(),
            devname: 'Cisco-ASA',
            type: 'security',
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
exports.CiscoCollector = CiscoCollector;
