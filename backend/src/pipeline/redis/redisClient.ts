import { logger } from '../../utils/logger';

export class RedisStreamPipeline {
  private inMemoryQueue: any[] = [];
  private isProcessing = false;
  private totalProduced = 0;
  private totalConsumed = 0;

  public async produce(log: any): Promise<void> {
    this.totalProduced++;
    this.inMemoryQueue.push(log);
    if (this.inMemoryQueue.length > 50000) {
      this.inMemoryQueue.shift();
    }
  }

  public async consumeBatch(batchSize = 100): Promise<any[]> {
    if (this.inMemoryQueue.length === 0) return [];
    const batch = this.inMemoryQueue.splice(0, batchSize);
    this.totalConsumed += batch.length;
    return batch;
  }

  public getPipelineStats() {
    return {
      queueLength: this.inMemoryQueue.length,
      totalProduced: this.totalProduced,
      totalConsumed: this.totalConsumed,
    };
  }
}

export const redisPipeline = new RedisStreamPipeline();
