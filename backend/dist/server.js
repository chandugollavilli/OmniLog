"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const socketServer_1 = require("./websocket/socketServer");
const syslogReceiver_1 = require("./collectors/syslogReceiver");
const authService_1 = require("./services/authService");
const logQueue_1 = require("./collectors/logQueue");
const prisma_1 = require("./database/prisma");
// Register Plugin Collectors into CollectorRegistry
const CollectorRegistry_1 = require("./collectors/base/CollectorRegistry");
const FortiGateCollector_1 = require("./collectors/fortigate/FortiGateCollector");
const PaloAltoCollector_1 = require("./collectors/paloalto/PaloAltoCollector");
const CiscoCollector_1 = require("./collectors/cisco/CiscoCollector");
const LinuxCollector_1 = require("./collectors/linux/LinuxCollector");
CollectorRegistry_1.collectorRegistry.register(new FortiGateCollector_1.FortiGateCollector());
CollectorRegistry_1.collectorRegistry.register(new PaloAltoCollector_1.PaloAltoCollector());
CollectorRegistry_1.collectorRegistry.register(new CiscoCollector_1.CiscoCollector());
CollectorRegistry_1.collectorRegistry.register(new LinuxCollector_1.LinuxCollector());
const server = http_1.default.createServer(app_1.default);
// Initialize WebSockets
(0, socketServer_1.initSocketServer)(server);
async function startServer() {
    try {
        // Wait for database connection to be ready with retries
        await (0, prisma_1.connectWithRetry)();
        server.listen(env_1.env.PORT, async () => {
            logger_1.logger.info(`==========================================================`);
            logger_1.logger.info(`  OmniLog Engine Running on Port ${env_1.env.PORT}`);
            logger_1.logger.info(`  Environment: ${env_1.env.NODE_ENV}`);
            logger_1.logger.info(`  Swagger API Docs: http://localhost:${env_1.env.PORT}/api/v1/docs`);
            logger_1.logger.info(`==========================================================`);
            // Register Default Admin Account if Database is fresh
            try {
                await authService_1.AuthService.registerDefaultAdmin();
            }
            catch (err) {
                logger_1.logger.warn('Could not register default admin account:', err);
            }
            // Start Syslog Receiver (UDP/TCP listeners)
            syslogReceiver_1.syslogReceiver.start();
        });
    }
    catch (err) {
        logger_1.logger.error('Failed to start OmniLog server due to database initialization failure:', err);
        process.exit(1);
    }
}
const gracefulShutdown = () => {
    logger_1.logger.info('Received shutdown signal. Stopping services cleanly...');
    syslogReceiver_1.syslogReceiver.stop();
    logQueue_1.logQueue.stop();
    server.close(() => {
        logger_1.logger.info('OmniLog HTTP & Socket Server closed.');
        process.exit(0);
    });
};
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
startServer();
