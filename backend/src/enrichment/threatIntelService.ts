export class ThreatIntelService {
  private static maliciousIPs = new Set([
    '185.220.101.5',
    '45.155.205.233',
    '194.26.29.112',
    '193.142.146.35',
  ]);

  public static checkIOC(ip?: string): { isThreat: boolean; threatName?: string } {
    if (!ip) return { isThreat: false };

    if (this.maliciousIPs.has(ip)) {
      return {
        isThreat: true,
        threatName: 'AbuseIPDB Flagged Malicious Scanner / Tor Exit Node',
      };
    }

    return { isThreat: false };
  }
}
