"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortiGateCollector = void 0;
const CollectorInterface_1 = require("../base/CollectorInterface");
const fortigateParser_1 = require("../../parsers/fortigateParser");
const logQueue_1 = require("../logQueue");
class FortiGateCollector extends CollectorInterface_1.BaseCollector {
    name = 'FortiGate Syslog Collector';
    vendor = 'fortigate';
    async receive(rawMessage, metadata) {
        const parsed = this.parse(rawMessage);
        if (metadata?.srcip && !parsed.srcip) {
            parsed.srcip = metadata.srcip;
        }
        const normalized = this.normalize(parsed, rawMessage);
        logQueue_1.logQueue.enqueue(normalized);
    }
    parse(rawMessage) {
        return (0, fortigateParser_1.parseFortiGateLog)(rawMessage);
    }
    normalize(parsed, rawMessage) {
        return {
            vendor: this.vendor,
            timestamp: parsed.timestamp || new Date(),
            devname: parsed.devname,
            devid: parsed.devid,
            logid: parsed.logid,
            type: parsed.type,
            subtype: parsed.subtype,
            level: parsed.level,
            vd: parsed.vd || 'root',
            srcip: parsed.srcip,
            dstip: parsed.dstip,
            srcport: parsed.srcport,
            dstport: parsed.dstport,
            proto: parsed.proto,
            action: parsed.action,
            policyid: parsed.policyid,
            polname: parsed.polname,
            user: parsed.user,
            srcintf: parsed.srcintf,
            dstintf: parsed.dstintf,
            sentbyte: parsed.sentbyte,
            rcvdbyte: parsed.rcvdbyte,
            duration: parsed.duration,
            app: parsed.app,
            service: parsed.service,
            sessionid: parsed.sessionid,
            tranip: parsed.tranip,
            trport: parsed.trport,
            srccountry: parsed.srccountry,
            dstcountry: parsed.dstcountry,
            url: parsed.url,
            threat: parsed.threat,
            msg: parsed.msg,
            raw: rawMessage,
        };
    }
    async store(batch) {
        // Database storage handled via logQueue bulk writer
    }
}
exports.FortiGateCollector = FortiGateCollector;
