"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFortiGateLog = parseFortiGateLog;
/**
 * Parses a raw FortiGate Syslog string into a structured object.
 */
function parseFortiGateLog(rawMessage) {
    const kvPairs = {};
    // Regex to extract key=value or key="value with spaces"
    // Handles keys like devname, srcip, polname, etc.
    const regex = /([a-zA-Z0-9_-]+)=(?:"([^"]*)"|([^\s]+))/g;
    let match;
    while ((match = regex.exec(rawMessage)) !== null) {
        const key = match[1];
        const value = match[2] !== undefined ? match[2] : match[3];
        kvPairs[key] = value;
    }
    // Construct timestamp from date and time keys if present, otherwise default to current time
    let timestamp = new Date();
    if (kvPairs.date && kvPairs.time) {
        const timeStr = `${kvPairs.date}T${kvPairs.time}Z`;
        const parsedTime = new Date(timeStr);
        if (!isNaN(parsedTime.getTime())) {
            timestamp = parsedTime;
        }
    }
    else if (kvPairs.eventtime) {
        const seconds = parseInt(kvPairs.eventtime.substring(0, 10), 10);
        if (!isNaN(seconds)) {
            timestamp = new Date(seconds * 1000);
        }
    }
    const parseIntOrUndefined = (val) => {
        if (!val)
            return undefined;
        const num = parseInt(val, 10);
        return isNaN(num) ? undefined : num;
    };
    const parseBigIntOrUndefined = (val) => {
        if (!val)
            return undefined;
        try {
            return BigInt(val);
        }
        catch {
            return undefined;
        }
    };
    return {
        timestamp,
        devname: kvPairs.devname || kvPairs.hostname,
        devid: kvPairs.devid,
        logid: kvPairs.logid,
        type: kvPairs.type,
        subtype: kvPairs.subtype,
        level: kvPairs.level,
        vd: kvPairs.vd || 'root',
        srcip: kvPairs.srcip || kvPairs.src,
        dstip: kvPairs.dstip || kvPairs.dst,
        srcport: parseIntOrUndefined(kvPairs.srcport),
        dstport: parseIntOrUndefined(kvPairs.dstport),
        proto: parseIntOrUndefined(kvPairs.proto),
        action: kvPairs.action,
        policyid: parseIntOrUndefined(kvPairs.policyid),
        polname: kvPairs.polname,
        user: kvPairs.user || kvPairs.srcuser,
        srcintf: kvPairs.srcintf,
        dstintf: kvPairs.dstintf,
        sentbyte: parseBigIntOrUndefined(kvPairs.sentbyte),
        rcvdbyte: parseBigIntOrUndefined(kvPairs.rcvdbyte),
        duration: parseIntOrUndefined(kvPairs.duration),
        app: kvPairs.app || kvPairs.appcat,
        service: kvPairs.service,
        sessionid: parseBigIntOrUndefined(kvPairs.sessionid),
        tranip: kvPairs.tranip || kvPairs.transip,
        trport: parseIntOrUndefined(kvPairs.trport || kvPairs.transport),
        srccountry: kvPairs.srccountry || kvPairs.srcdomain,
        dstcountry: kvPairs.dstcountry || kvPairs.dstdomain,
        msg: kvPairs.msg,
        raw: rawMessage,
    };
}
