import { BaseCollector, NormalizedLog } from '../base/CollectorInterface';
import { logQueue } from '../logQueue';

export class PaloAltoCollector extends BaseCollector {
  public readonly name = 'Palo Alto Networks Collector';
  public readonly vendor = 'paloalto';

  public async receive(rawMessage: string, metadata?: any): Promise<void> {
    const parsed = this.parse(rawMessage);
    const normalized = this.normalize(parsed, rawMessage);
    logQueue.enqueue(normalized);
  }

  public parse(rawMessage: string): any {
    // Palo Alto CSV Syslog Format parsing
    const parts = rawMessage.split(',');
    return {
      timestamp: parts[1] ? new Date(parts[1]) : new Date(),
      devname: parts[3] || 'PaloAlto-FW',
      type: parts[4] || 'TRAFFIC',
      srcip: parts[7],
      dstip: parts[8],
      srcport: parts[10] ? parseInt(parts[10], 10) : undefined,
      dstport: parts[11] ? parseInt(parts[11], 10) : undefined,
      action: parts[14] || 'allow',
      app: parts[15],
      user: parts[12],
    };
  }

  public normalize(parsed: any, rawMessage: string): NormalizedLog {
    return {
      vendor: this.vendor,
      timestamp: parsed.timestamp,
      devname: parsed.devname,
      type: parsed.type,
      srcip: parsed.srcip,
      dstip: parsed.dstip,
      srcport: parsed.srcport,
      dstport: parsed.dstport,
      action: parsed.action,
      app: parsed.app,
      user: parsed.user,
      raw: rawMessage,
    };
  }

  public async store(batch: NormalizedLog[]): Promise<void> {}
}
