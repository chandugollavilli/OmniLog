"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fortigateParser_1 = require("../parsers/fortigateParser");
(0, vitest_1.describe)('FortiGate Syslog Parser', () => {
    (0, vitest_1.it)('should parse standard FortiGate traffic log correctly', () => {
        const raw = '<189>date=2026-07-30 time=15:00:00 devname="FG100D" devid="FG100D3G15800001" logid="0000000013" type="traffic" subtype="forward" level="notice" vd="root" srcip=192.168.1.105 dstip=8.8.8.8 srcport=54321 dstport=53 proto=17 action="accept" policyid=1 polname="Allow-Outbound" user="john.doe" app="DNS" duration=12 sentbyte=120 rcvdbyte=450 srccountry="United States" dstcountry="United States" msg="Traffic log entry"';
        const parsed = (0, fortigateParser_1.parseFortiGateLog)(raw);
        (0, vitest_1.expect)(parsed.devname).toBe('FG100D');
        (0, vitest_1.expect)(parsed.devid).toBe('FG100D3G15800001');
        (0, vitest_1.expect)(parsed.type).toBe('traffic');
        (0, vitest_1.expect)(parsed.subtype).toBe('forward');
        (0, vitest_1.expect)(parsed.level).toBe('notice');
        (0, vitest_1.expect)(parsed.srcip).toBe('192.168.1.105');
        (0, vitest_1.expect)(parsed.dstip).toBe('8.8.8.8');
        (0, vitest_1.expect)(parsed.srcport).toBe(54321);
        (0, vitest_1.expect)(parsed.dstport).toBe(53);
        (0, vitest_1.expect)(parsed.proto).toBe(17);
        (0, vitest_1.expect)(parsed.action).toBe('accept');
        (0, vitest_1.expect)(parsed.policyid).toBe(1);
        (0, vitest_1.expect)(parsed.polname).toBe('Allow-Outbound');
        (0, vitest_1.expect)(parsed.user).toBe('john.doe');
        (0, vitest_1.expect)(parsed.app).toBe('DNS');
        (0, vitest_1.expect)(parsed.sentbyte).toBe(120n);
        (0, vitest_1.expect)(parsed.rcvdbyte).toBe(450n);
        (0, vitest_1.expect)(parsed.raw).toBe(raw);
    });
    (0, vitest_1.it)('should handle missing optional fields gracefully', () => {
        const raw = 'date=2026-07-30 time=12:00:00 devname="FG-TEST" action="deny" srcip=10.0.0.1 dstip=10.0.0.2';
        const parsed = (0, fortigateParser_1.parseFortiGateLog)(raw);
        (0, vitest_1.expect)(parsed.devname).toBe('FG-TEST');
        (0, vitest_1.expect)(parsed.action).toBe('deny');
        (0, vitest_1.expect)(parsed.srcip).toBe('10.0.0.1');
        (0, vitest_1.expect)(parsed.dstip).toBe('10.0.0.2');
        (0, vitest_1.expect)(parsed.user).toBeUndefined();
        (0, vitest_1.expect)(parsed.sentbyte).toBeUndefined();
    });
});
