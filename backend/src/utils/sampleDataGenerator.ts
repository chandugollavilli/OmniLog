import dgram from 'dgram';
import { env } from '../config/env';
import { logger } from './logger';

/**
 * Utility script to generate synthetic FortiGate Syslog traffic for demo environments.
 */
export function startSyntheticLogGenerator(intervalMs = 1000): void {
  const client = dgram.createSocket('udp4');

  const sampleLogs = [
    '<189>date=2026-07-30 time=15:00:00 devname="HQ-FG100D" devid="FG100D3G15800001" logid="0000000013" type="traffic" subtype="forward" level="notice" vd="root" srcip=192.168.1.105 dstip=8.8.8.8 srcport=54321 dstport=53 proto=17 action="accept" policyid=1 polname="Allow-Outbound" user="john.doe" app="DNS" duration=12 sentbyte=120 rcvdbyte=450 srccountry="United States" dstcountry="United States" msg="Traffic log entry"',
    '<189>date=2026-07-30 time=15:01:00 devname="HQ-FG100D" devid="FG100D3G15800001" logid="0000000014" type="traffic" subtype="forward" level="warning" vd="root" srcip=185.220.101.5 dstip=192.168.1.1 srcport=43210 dstport=22 proto=6 action="deny" policyid=2 polname="Deny-SSH" app="SSH" duration=1 sentbyte=60 rcvdbyte=0 srccountry="Russia" dstcountry="United States" msg="Denied SSH attempt"',
    '<189>date=2026-07-30 time=15:02:00 devname="HQ-FG100D" devid="FG100D3G15800001" logid="0000000015" type="utm" subtype="virus" level="critical" vd="root" srcip=45.155.205.233 dstip=10.0.0.45 srcport=55432 dstport=80 proto=6 action="block" policyid=3 polname="UTM-Protect" app="HTTP" duration=5 sentbyte=500 rcvdbyte=2000 srccountry="China" dstcountry="United States" msg="Malware payload blocked"',
  ];

  let index = 0;
  setInterval(() => {
    const raw = sampleLogs[index % sampleLogs.length];
    const message = Buffer.from(raw);

    client.send(message, env.SYSLOG_UDP_PORT, 'localhost', (err) => {
      if (err) {
        logger.error('Error sending synthetic sample log:', err);
      }
    });

    index++;
  }, intervalMs);

  logger.info(`Synthetic FortiGate Log Generator running every ${intervalMs}ms targeting UDP localhost:${env.SYSLOG_UDP_PORT}`);
}
