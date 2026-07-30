"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectorRegistry = void 0;
const logger_1 = require("../../utils/logger");
class CollectorRegistry {
    collectors = new Map();
    register(collector) {
        if (this.collectors.has(collector.vendor)) {
            logger_1.logger.warn(`Collector vendor '${collector.vendor}' is already registered. Overwriting.`);
        }
        this.collectors.set(collector.vendor, collector);
        logger_1.logger.info(`Registered Log Collector Plugin: [${collector.name}] for vendor [${collector.vendor}]`);
    }
    getCollector(vendor) {
        return this.collectors.get(vendor.toLowerCase());
    }
    getAllCollectors() {
        return Array.from(this.collectors.values());
    }
}
exports.collectorRegistry = new CollectorRegistry();
