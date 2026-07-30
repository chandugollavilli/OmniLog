"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sigmaEngine = exports.SigmaEngine = void 0;
const logger_1 = require("../utils/logger");
class SigmaEngine {
    rules = [
        {
            title: 'Suspicious SSH Connection Denied',
            id: 'sigma-001-ssh-deny',
            status: 'stable',
            description: 'Detects blocked SSH access attempts to external servers',
            detection: {
                selection: { dstport: 22, action: 'deny' },
                condition: 'selection',
            },
            level: 'high',
        },
    ];
    evaluateLog(log) {
        for (const rule of this.rules) {
            const selection = rule.detection.selection;
            let matched = true;
            for (const [key, val] of Object.entries(selection)) {
                if (log[key] !== val) {
                    matched = false;
                    break;
                }
            }
            if (matched) {
                logger_1.logger.info(`🎯 Sigma Rule Matched: [${rule.id}] ${rule.title}`);
                return rule;
            }
        }
        return null;
    }
}
exports.SigmaEngine = SigmaEngine;
exports.sigmaEngine = new SigmaEngine();
