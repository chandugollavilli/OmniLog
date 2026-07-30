import { logger } from '../utils/logger';

export interface SigmaRuleDefinition {
  title: string;
  id: string;
  status: string;
  description: string;
  detection: {
    selection: Record<string, any>;
    condition: string;
  };
  level: string;
}

export class SigmaEngine {
  private rules: SigmaRuleDefinition[] = [
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

  public evaluateLog(log: any): SigmaRuleDefinition | null {
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
        logger.info(`🎯 Sigma Rule Matched: [${rule.id}] ${rule.title}`);
        return rule;
      }
    }
    return null;
  }
}

export const sigmaEngine = new SigmaEngine();
