import { BaseCollector } from './CollectorInterface';
import { logger } from '../../utils/logger';

class CollectorRegistry {
  private collectors: Map<string, BaseCollector> = new Map();

  public register(collector: BaseCollector): void {
    if (this.collectors.has(collector.vendor)) {
      logger.warn(`Collector vendor '${collector.vendor}' is already registered. Overwriting.`);
    }
    this.collectors.set(collector.vendor, collector);
    logger.info(`Registered Log Collector Plugin: [${collector.name}] for vendor [${collector.vendor}]`);
  }

  public getCollector(vendor: string): BaseCollector | undefined {
    return this.collectors.get(vendor.toLowerCase());
  }

  public getAllCollectors(): BaseCollector[] {
    return Array.from(this.collectors.values());
  }
}

export const collectorRegistry = new CollectorRegistry();
