"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastMetricUpdate = exports.broadcastAlert = exports.broadcastLog = exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("../utils/logger");
let io = null;
const initSocketServer = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        logger_1.logger.info(`WebSocket Client connected: ${socket.id}`);
        socket.on('subscribe:logs', () => {
            socket.join('live_logs');
            logger_1.logger.debug(`Socket ${socket.id} subscribed to live_logs`);
        });
        socket.on('unsubscribe:logs', () => {
            socket.leave('live_logs');
            logger_1.logger.debug(`Socket ${socket.id} unsubscribed from live_logs`);
        });
        socket.on('disconnect', () => {
            logger_1.logger.info(`WebSocket Client disconnected: ${socket.id}`);
        });
    });
    logger_1.logger.info('Socket.IO Server initialized.');
    return io;
};
exports.initSocketServer = initSocketServer;
const broadcastLog = (log) => {
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
exports.broadcastLog = broadcastLog;
const broadcastAlert = (alert) => {
    if (io) {
        io.emit('new_alert', alert);
    }
};
exports.broadcastAlert = broadcastAlert;
const broadcastMetricUpdate = (metrics) => {
    if (io) {
        io.emit('metrics_update', metrics);
    }
};
exports.broadcastMetricUpdate = broadcastMetricUpdate;
