import { describe, it, expect } from 'vitest';
import { parseFortiGateLog } from '../parsers/fortigateParser';

describe('FortiGate Syslog Parser', () => {
  it('should parse standard FortiGate traffic log correctly', () => {
    const raw = '<189>date=2026-07-30 time=15:00:00 devname="FG100D" devid="FG100D3G15800001" logid="0000000013" type="traffic" subtype="forward" level="notice" vd="root" srcip=192.168.1.105 dstip=8.8.8.8 srcport=54321 dstport=53 proto=17 action="accept" policyid=1 polname="Allow-Outbound" user="john.doe" app="DNS" duration=12 sentbyte=120 rcvdbyte=450 srccountry="United States" dstcountry="United States" msg="Traffic log entry"';

    const parsed = parseFortiGateLog(raw);

    expect(parsed.devname).toBe('FG100D');
    expect(parsed.devid).toBe('FG100D3G15800001');
    expect(parsed.type).toBe('traffic');
    expect(parsed.subtype).toBe('forward');
    expect(parsed.level).toBe('notice');
    expect(parsed.srcip).toBe('192.168.1.105');
    expect(parsed.dstip).toBe('8.8.8.8');
    expect(parsed.srcport).toBe(54321);
    expect(parsed.dstport).toBe(53);
    expect(parsed.proto).toBe(17);
    expect(parsed.action).toBe('accept');
    expect(parsed.policyid).toBe(1);
    expect(parsed.polname).toBe('Allow-Outbound');
    expect(parsed.user).toBe('john.doe');
    expect(parsed.app).toBe('DNS');
    expect(parsed.sentbyte).toBe(120n);
    expect(parsed.rcvdbyte).toBe(450n);
    expect(parsed.raw).toBe(raw);
  });

  it('should handle missing optional fields gracefully', () => {
    const raw = 'date=2026-07-30 time=12:00:00 devname="FG-TEST" action="deny" srcip=10.0.0.1 dstip=10.0.0.2';
    const parsed = parseFortiGateLog(raw);

    expect(parsed.devname).toBe('FG-TEST');
    expect(parsed.action).toBe('deny');
    expect(parsed.srcip).toBe('10.0.0.1');
    expect(parsed.dstip).toBe('10.0.0.2');
    expect(parsed.user).toBeUndefined();
    expect(parsed.sentbyte).toBeUndefined();
  });
});
