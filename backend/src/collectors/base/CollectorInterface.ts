export interface NormalizedLog {
  vendor: string; // fortigate, paloalto, cisco, sophos, linux, etc.
  timestamp: Date;
  devname?: string;
  devid?: string;
  logid?: string;
  type?: string;
  subtype?: string;
  level?: string;
  vd?: string;
  srcip?: string;
  dstip?: string;
  srcport?: number;
  dstport?: number;
  proto?: number;
  action?: string;
  policyid?: number;
  polname?: string;
  user?: string;
  srcintf?: string;
  dstintf?: string;
  sentbyte?: bigint;
  rcvdbyte?: bigint;
  duration?: number;
  app?: string;
  service?: string;
  sessionid?: bigint;
  tranip?: string;
  trport?: number;
  srccountry?: string;
  dstcountry?: string;
  url?: string;
  threat?: string;
  msg?: string;
  raw: string;
}

export abstract class BaseCollector {
  public abstract readonly name: string;
  public abstract readonly vendor: string;

  public abstract receive(rawMessage: string, metadata?: any): Promise<void>;
  public abstract parse(rawMessage: string): any;
  public abstract normalize(parsed: any, rawMessage: string): NormalizedLog;
  public abstract store(batch: NormalizedLog[]): Promise<void>;
}
