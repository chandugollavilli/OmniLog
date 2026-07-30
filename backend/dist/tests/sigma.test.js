"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const sigmaEngine_1 = require("../siem/sigmaEngine");
(0, vitest_1.describe)('Sigma Detection Engine', () => {
    (0, vitest_1.it)('should match suspicious SSH denied log entry', () => {
        const engine = new sigmaEngine_1.SigmaEngine();
        const testLog = {
            dstport: 22,
            action: 'deny',
            srcip: '198.51.100.45',
        };
        const match = engine.evaluateLog(testLog);
        (0, vitest_1.expect)(match).not.toBeNull();
        (0, vitest_1.expect)(match?.id).toBe('sigma-001-ssh-deny');
    });
    (0, vitest_1.it)('should return null for normal accepted web traffic', () => {
        const engine = new sigmaEngine_1.SigmaEngine();
        const testLog = {
            dstport: 443,
            action: 'accept',
            srcip: '192.168.1.50',
        };
        const match = engine.evaluateLog(testLog);
        (0, vitest_1.expect)(match).toBeNull();
    });
});
