import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { ParsedFortiGateLog } from '../parsers/fortigateParser';

let io: Server | null = null;

export const initSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`WebSocket Client connected: ${socket.id}`);

    socket.on('subscribe:logs', () => {
      socket.join('live_logs');
      logger.debug(`Socket ${socket.id} subscribed to live_logs`);
    });

    socket.on('unsubscribe:logs', () => {
      socket.leave('live_logs');
      logger.debug(`Socket ${socket.id} unsubscribed from live_logs`);
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket Client disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO Server initialized.');
  return io;
};

export const broadcastLog = (log: ParsedFortiGateLog): void => {
  if (io) {
    // BigInt values must be serialized to String or Number for JSON JSON.stringify in Socket.IO
    const safeLog = {
      ...log,
      sentbyte: log.sentbyte ? log.sentbyte.toString() : undefined,
      rcvdbyte: log.rcvdbyte ? log.rcvdbyte.toString() : undefined,
      sessionid: log.sessionid ? log.sessionid.toString() : undefined,
    };
    io.to('live_logs').emit('new_log', safeLog);
  }
};

export const broadcastAlert = (alert: any): void => {
  if (io) {
    io.emit('new_alert', alert);
  }
};

export const broadcastMetricUpdate = (metrics: any): void => {
  if (io) {
    io.emit('metrics_update', metrics);
  }
};
