"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreatIntelService = void 0;
class ThreatIntelService {
    static maliciousIPs = new Set([
        '185.220.101.5',
        '45.155.205.233',
        '194.26.29.112',
        '193.142.146.35',
    ]);
    static checkIOC(ip) {
        if (!ip)
            return { isThreat: false };
        if (this.maliciousIPs.has(ip)) {
            return {
                isThreat: true,
                threatName: 'AbuseIPDB Flagged Malicious Scanner / Tor Exit Node',
            };
        }
        return { isThreat: false };
    }
}
exports.ThreatIntelService = ThreatIntelService;
