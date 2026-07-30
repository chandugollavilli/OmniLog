"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syslogReceiver = exports.SyslogReceiver = void 0;
const dgram_1 = __importDefault(require("dgram"));
const net_1 = __importDefault(require("net"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const fortigateParser_1 = require("../parsers/fortigateParser");
const logQueue_1 = require("./logQueue");
class SyslogReceiver {
    udpSocket = null;
    tcpServer = null;
    tlsServer = null;
    start() {
        this.startUDP();
        this.startTCP();
    }
    startUDP() {
        try {
            this.udpSocket = dgram_1.default.createSocket('udp4');
            this.udpSocket.on('message', (msg, rinfo) => {
                const raw = msg.toString('utf-8');
                try {
                    const parsed = (0, fortigateParser_1.parseFortiGateLog)(raw);
                    if (!parsed.srcip)
                        parsed.srcip = rinfo.address;
                    logQueue_1.logQueue.enqueue(parsed);
                }
                catch (err) {
                    logger_1.logger.error('UDP Syslog Parse Error:', err);
                }
            });
            this.udpSocket.on('error', (err) => {
                logger_1.logger.error(`UDP Syslog Receiver error on port ${env_1.env.SYSLOG_UDP_PORT}:`, err);
            });
            this.udpSocket.bind(env_1.env.SYSLOG_UDP_PORT, () => {
                logger_1.logger.info(`Syslog UDP Listener running on port ${env_1.env.SYSLOG_UDP_PORT}`);
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to initialize UDP Syslog Listener:', error);
        }
    }
    startTCP() {
        try {
            this.tcpServer = net_1.default.createServer((socket) => {
                let buffer = '';
                const remoteIp = socket.remoteAddress || '';
                socket.on('data', (data) => {
                    buffer += data.toString('utf-8');
                    const lines = buffer.split('\n');
                    // Process all full lines, keep remaining incomplete segment in buffer
                    buffer = lines.pop() || '';
                    for (const line of lines) {
                        if (line.trim().length === 0)
                            continue;
                        try {
                            const parsed = (0, fortigateParser_1.parseFortiGateLog)(line);
                            if (!parsed.srcip)
                                parsed.srcip = remoteIp;
                            logQueue_1.logQueue.enqueue(parsed);
                        }
                        catch (err) {
                            logger_1.logger.error('TCP Syslog Parse Error:', err);
                        }
                    }
                });
                socket.on('error', (err) => {
                    logger_1.logger.debug('TCP Syslog client connection error:', err);
                });
            });
            this.tcpServer.on('error', (err) => {
                logger_1.logger.error(`TCP Syslog Receiver error on port ${env_1.env.SYSLOG_TCP_PORT}:`, err);
            });
            this.tcpServer.listen(env_1.env.SYSLOG_TCP_PORT, () => {
                logger_1.logger.info(`Syslog TCP Listener running on port ${env_1.env.SYSLOG_TCP_PORT}`);
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to initialize TCP Syslog Listener:', error);
        }
    }
    stop() {
        if (this.udpSocket) {
            this.udpSocket.close();
            logger_1.logger.info('UDP Syslog Listener stopped.');
        }
        if (this.tcpServer) {
            this.tcpServer.close();
            logger_1.logger.info('TCP Syslog Listener stopped.');
        }
    }
}
exports.SyslogReceiver = SyslogReceiver;
exports.syslogReceiver = new SyslogReceiver();
