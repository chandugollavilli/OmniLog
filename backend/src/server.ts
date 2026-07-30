import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { initSocketServer } from './websocket/socketServer';
import { syslogReceiver } from './collectors/syslogReceiver';
import { AuthService } from './services/authService';
import { logQueue } from './collectors/logQueue';

// Register Plugin Collectors into CollectorRegistry
import { collectorRegistry } from './collectors/base/CollectorRegistry';
import { FortiGateCollector } from './collectors/fortigate/FortiGateCollector';
import { PaloAltoCollector } from './collectors/paloalto/PaloAltoCollector';
import { CiscoCollector } from './collectors/cisco/CiscoCollector';
import { LinuxCollector } from './collectors/linux/LinuxCollector';

collectorRegistry.register(new FortiGateCollector());
collectorRegistry.register(new PaloAltoCollector());
collectorRegistry.register(new CiscoCollector());
collectorRegistry.register(new LinuxCollector());

const server = http.createServer(app);

// Initialize WebSockets
initSocketServer(server);

server.listen(env.PORT, async () => {
  logger.info(`==========================================================`);
  logger.info(`  OmniLog V2 Engine Running on Port ${env.PORT}`);
  logger.info(`  Environment: ${env.NODE_ENV}`);
  logger.info(`  Swagger API Docs: http://localhost:${env.PORT}/api/v1/docs`);
  logger.info(`==========================================================`);

  // Register Default Admin Account if Database is fresh
  try {
    await AuthService.registerDefaultAdmin();
  } catch (err) {
    logger.warn('Could not register default admin account:', err);
  }

  // Start Syslog Receiver (UDP/TCP listeners)
  syslogReceiver.start();
});

const gracefulShutdown = () => {
  logger.info('Received shutdown signal. Stopping services cleanly...');
  syslogReceiver.stop();
  logQueue.stop();
  server.close(() => {
    logger.info('OmniLog HTTP & Socket Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
