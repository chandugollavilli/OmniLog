import dgram from 'dgram';
import net from 'net';
import tls from 'tls';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { parseFortiGateLog } from '../parsers/fortigateParser';
import { logQueue } from './logQueue';

export class SyslogReceiver {
  private udpSocket: dgram.Socket | null = null;
  private tcpServer: net.Server | null = null;
  private tlsServer: tls.Server | null = null;

  public start(): void {
    this.startUDP();
    this.startTCP();
  }

  private startUDP(): void {
    try {
      this.udpSocket = dgram.createSocket('udp4');

      this.udpSocket.on('message', (msg, rinfo) => {
        const raw = msg.toString('utf-8');
        try {
          const parsed = parseFortiGateLog(raw);
          if (!parsed.srcip) parsed.srcip = rinfo.address;
          logQueue.enqueue(parsed);
        } catch (err) {
          logger.error('UDP Syslog Parse Error:', err);
        }
      });

      this.udpSocket.on('error', (err) => {
        logger.error(`UDP Syslog Receiver error on port ${env.SYSLOG_UDP_PORT}:`, err);
      });

      this.udpSocket.bind(env.SYSLOG_UDP_PORT, () => {
        logger.info(`Syslog UDP Listener running on port ${env.SYSLOG_UDP_PORT}`);
      });
    } catch (error) {
      logger.error('Failed to initialize UDP Syslog Listener:', error);
    }
  }

  private startTCP(): void {
    try {
      this.tcpServer = net.createServer((socket) => {
        let buffer = '';
        const remoteIp = socket.remoteAddress || '';

        socket.on('data', (data) => {
          buffer += data.toString('utf-8');
          const lines = buffer.split('\n');
          // Process all full lines, keep remaining incomplete segment in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim().length === 0) continue;
            try {
              const parsed = parseFortiGateLog(line);
              if (!parsed.srcip) parsed.srcip = remoteIp;
              logQueue.enqueue(parsed);
            } catch (err) {
              logger.error('TCP Syslog Parse Error:', err);
            }
          }
        });

        socket.on('error', (err) => {
          logger.debug('TCP Syslog client connection error:', err);
        });
      });

      this.tcpServer.on('error', (err) => {
        logger.error(`TCP Syslog Receiver error on port ${env.SYSLOG_TCP_PORT}:`, err);
      });

      this.tcpServer.listen(env.SYSLOG_TCP_PORT, () => {
        logger.info(`Syslog TCP Listener running on port ${env.SYSLOG_TCP_PORT}`);
      });
    } catch (error) {
      logger.error('Failed to initialize TCP Syslog Listener:', error);
    }
  }

  public stop(): void {
    if (this.udpSocket) {
      this.udpSocket.close();
      logger.info('UDP Syslog Listener stopped.');
    }
    if (this.tcpServer) {
      this.tcpServer.close();
      logger.info('TCP Syslog Listener stopped.');
    }
  }
}

export const syslogReceiver = new SyslogReceiver();
