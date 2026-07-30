import { describe, it, expect } from 'vitest';
import { SigmaEngine } from '../siem/sigmaEngine';

describe('Sigma Detection Engine', () => {
  it('should match suspicious SSH denied log entry', () => {
    const engine = new SigmaEngine();
    const testLog = {
      dstport: 22,
      action: 'deny',
      srcip: '198.51.100.45',
    };

    const match = engine.evaluateLog(testLog);
    expect(match).not.toBeNull();
    expect(match?.id).toBe('sigma-001-ssh-deny');
  });

  it('should return null for normal accepted web traffic', () => {
    const engine = new SigmaEngine();
    const testLog = {
      dstport: 443,
      action: 'accept',
      srcip: '192.168.1.50',
    };

    const match = engine.evaluateLog(testLog);
    expect(match).toBeNull();
  });
});
