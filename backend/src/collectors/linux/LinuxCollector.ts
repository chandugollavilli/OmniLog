import { BaseCollector, NormalizedLog } from '../base/CollectorInterface';
import { logQueue } from '../logQueue';

export class LinuxCollector extends BaseCollector {
  public readonly name = 'Linux Syslog / Journald Collector';
  public readonly vendor = 'linux';

  public async receive(rawMessage: string, metadata?: any): Promise<void> {
    const parsed = this.parse(rawMessage);
    const normalized = this.normalize(parsed, rawMessage);
    logQueue.enqueue(normalized);
  }

  public parse(rawMessage: string): any {
    return {
      timestamp: new Date(),
      devname: 'Linux-Server',
      type: 'syslog',
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
