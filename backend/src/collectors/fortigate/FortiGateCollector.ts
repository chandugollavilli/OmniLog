import { BaseCollector, NormalizedLog } from '../base/CollectorInterface';
import { parseFortiGateLog } from '../../parsers/fortigateParser';
import { logQueue } from '../logQueue';

export class FortiGateCollector extends BaseCollector {
  public readonly name = 'FortiGate Syslog Collector';
  public readonly vendor = 'fortigate';

  public async receive(rawMessage: string, metadata?: any): Promise<void> {
    const parsed = this.parse(rawMessage);
    if (metadata?.srcip && !parsed.srcip) {
      parsed.srcip = metadata.srcip;
    }
    const normalized = this.normalize(parsed, rawMessage);
    logQueue.enqueue(normalized);
  }

  public parse(rawMessage: string): any {
    return parseFortiGateLog(rawMessage);
  }

  public normalize(parsed: any, rawMessage: string): NormalizedLog {
    return {
      vendor: this.vendor,
      timestamp: parsed.timestamp || new Date(),
      devname: parsed.devname,
      devid: parsed.devid,
      logid: parsed.logid,
      type: parsed.type,
      subtype: parsed.subtype,
      level: parsed.level,
      vd: parsed.vd || 'root',
      srcip: parsed.srcip,
      dstip: parsed.dstip,
      srcport: parsed.srcport,
      dstport: parsed.dstport,
      proto: parsed.proto,
      action: parsed.action,
      policyid: parsed.policyid,
      polname: parsed.polname,
      user: parsed.user,
      srcintf: parsed.srcintf,
      dstintf: parsed.dstintf,
      sentbyte: parsed.sentbyte,
      rcvdbyte: parsed.rcvdbyte,
      duration: parsed.duration,
      app: parsed.app,
      service: parsed.service,
      sessionid: parsed.sessionid,
      tranip: parsed.tranip,
      trport: parsed.trport,
      srccountry: parsed.srccountry,
      dstcountry: parsed.dstcountry,
      url: parsed.url,
      threat: parsed.threat,
      msg: parsed.msg,
      raw: rawMessage,
    };
  }

  public async store(batch: NormalizedLog[]): Promise<void> {
    // Database storage handled via logQueue bulk writer
  }
}
