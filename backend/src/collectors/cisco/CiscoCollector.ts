import { BaseCollector, NormalizedLog } from '../base/CollectorInterface';
import { logQueue } from '../logQueue';

export class CiscoCollector extends BaseCollector {
  public readonly name = 'Cisco ASA / Firepower Collector';
  public readonly vendor = 'cisco';

  public async receive(rawMessage: string, metadata?: any): Promise<void> {
    const parsed = this.parse(rawMessage);
    const normalized = this.normalize(parsed, rawMessage);
    logQueue.enqueue(normalized);
  }

  public parse(rawMessage: string): any {
    return {
      timestamp: new Date(),
      devname: 'Cisco-ASA',
      type: 'security',
      raw: rawMessage,
    };
  }

  public normalize(parsed: any, rawMessage: string): NormalizedLog {
    return {
      vendor: this.vendor,
      timestamp: parsed.timestamp,
      devname: parsed.devname,
      type: parsed.type,
      raw: rawMessage,
    };
  }

  public async store(batch: NormalizedLog[]): Promise<void> {}
}
