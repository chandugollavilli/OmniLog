class PipelineMetrics {
  private incomingCount = 0;
  private parsedCount = 0;
  private dbWriteCount = 0;
  private parserErrorsCount = 0;
  private droppedLogsCount = 0;

  private lastIncomingPerSec = 0;
  private lastParsedPerSec = 0;
  private lastDbWritesPerSec = 0;

  constructor() {
    setInterval(() => {
      this.lastIncomingPerSec = this.incomingCount;
      this.lastParsedPerSec = this.parsedCount;
      this.lastDbWritesPerSec = this.dbWriteCount;

      this.incomingCount = 0;
      this.parsedCount = 0;
      this.dbWriteCount = 0;
    }, 1000);
  }

  public recordIncoming(): void {
    this.incomingCount++;
  }

  public recordParsed(): void {
    this.parsedCount++;
  }

  public recordDbWrite(count: number): void {
    this.dbWriteCount += count;
  }

  public recordError(): void {
    this.parserErrorsCount++;
  }

  public recordDrop(): void {
    this.droppedLogsCount++;
  }

  public getMetrics(queueSize: number) {
    return {
      incomingLogsPerSec: this.lastIncomingPerSec,
      parsedLogsPerSec: this.lastParsedPerSec,
      dbWritesPerSec: this.lastDbWritesPerSec,
      parserErrors: this.parserErrorsCount,
      droppedLogs: this.droppedLogsCount,
      queueSize,
    };
  }
}

export const pipelineMetrics = new PipelineMetrics();
