"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisPipeline = exports.RedisStreamPipeline = void 0;
class RedisStreamPipeline {
    inMemoryQueue = [];
    isProcessing = false;
    totalProduced = 0;
    totalConsumed = 0;
    async produce(log) {
        this.totalProduced++;
        this.inMemoryQueue.push(log);
        if (this.inMemoryQueue.length > 50000) {
            this.inMemoryQueue.shift();
        }
    }
    async consumeBatch(batchSize = 100) {
        if (this.inMemoryQueue.length === 0)
            return [];
        const batch = this.inMemoryQueue.splice(0, batchSize);
        this.totalConsumed += batch.length;
        return batch;
    }
    getPipelineStats() {
        return {
            queueLength: this.inMemoryQueue.length,
            totalProduced: this.totalProduced,
            totalConsumed: this.totalConsumed,
        };
    }
}
exports.RedisStreamPipeline = RedisStreamPipeline;
exports.redisPipeline = new RedisStreamPipeline();
