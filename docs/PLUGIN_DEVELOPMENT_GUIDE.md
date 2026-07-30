# OmniLog V3 - Collector Plugin Development Guide

This guide details how to create custom log collectors for firewalls, servers, or cloud services (e.g., Sophos, Check Point, MikroTik, Windows Event Logs, Suricata).

---

## Step 1: Create Vendor Directory

Navigate to `backend/src/collectors/` and create your vendor directory:
```bash
mkdir -p backend/src/collectors/sophos
```

---

## Step 2: Implement Collector Class

Create `SophosCollector.ts` extending `BaseCollector`:

```typescript
import { BaseCollector, NormalizedLog } from '../base/CollectorInterface';
import { logQueue } from '../logQueue';

export class SophosCollector extends BaseCollector {
  public readonly name = 'Sophos XG Firewall Collector';
  public readonly vendor = 'sophos';

  public async receive(rawMessage: string, metadata?: any): Promise<void> {
    const parsed = this.parse(rawMessage);
    const normalized = this.normalize(parsed, rawMessage);
    logQueue.enqueue(normalized);
  }

  public parse(rawMessage: string): any {
    // Custom key-value or CSV parser implementation
    return {
      timestamp: new Date(),
      devname: 'Sophos-FW',
      raw: rawMessage,
    };
  }

  public normalize(parsed: any, rawMessage: string): NormalizedLog {
    return {
      vendor: this.vendor,
      timestamp: parsed.timestamp,
      devname: parsed.devname,
      raw: rawMessage,
    };
  }

  public async store(batch: NormalizedLog[]): Promise<void> {}
}
```

---

## Step 3: Register Collector in Server Bootstrap

In `backend/src/server.ts`, import and register your collector:

```typescript
import { collectorRegistry } from './collectors/base/CollectorRegistry';
import { SophosCollector } from './collectors/sophos/SophosCollector';

collectorRegistry.register(new SophosCollector());
```
