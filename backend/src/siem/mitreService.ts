export interface MitreMapping {
  tactic: string;
  technique: string;
  techniqueId: string;
  description: string;
}

export class MitreService {
  public static mapLogToMitre(log: any): MitreMapping | null {
    if ((log.dstport === 22 || log.dstport === 3389) && (log.action === 'deny' || log.action === 'block')) {
      return {
        tactic: 'Credential Access',
        technique: 'Brute Force',
        techniqueId: 'T1110',
        description: 'Automated login attempts targeting remote management access (SSH/RDP).',
      };
    }

    if (log.type === 'utm' || log.subtype === 'virus') {
      return {
        tactic: 'Execution',
        technique: 'User Execution: Malicious File',
        techniqueId: 'T1204.002',
        description: 'UTM engine flagged malicious binary or payload transmission.',
      };
    }

    return null;
  }
}
