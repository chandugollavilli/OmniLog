# OmniLog V3 - System Architecture & Design Specification

OmniLog V3 is built on **Clean Architecture** and **SOLID Design Principles** to ensure modularity, high availability, and horizontal scalability.

---

## 1. High-Level Architecture Diagram

```
[ Firewall & Syslog Forwarders ] (FortiGate, PaloAlto, Cisco, Linux)
                │
                ▼ (UDP 514/5140 | TCP 514/5140 | TLS 6514)
┌──────────────────────────────────────────────┐
│           Syslog Receiver Layer              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│        Plugin Collector Engine               │
│   (BaseCollector & CollectorRegistry)        │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│       Redis Streams Pipeline                 │ (omnilog:stream:logs)
└──────────────────────┬───────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐       ┌──────────────────┐
│ GeoIP & Threat   │       │ MITRE ATT&CK &   │
│ Intel Enrichment │       │  Sigma Engine    │
└─────────┬────────┘       └────────┬─────────┘
          │                         │
          └────────────┬────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐       ┌──────────────────┐
│ PostgreSQL DB    │       │ OpenSearch DB    │
│ (Partitioned)    │       │ (Bulk Indexed)   │
└─────────┬────────┘       └────────┬─────────┘
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│    SOAR Playbook Engine & WebSockets         │
│ (Auto-Block IP, Teams/Slack, Live Stream)    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ React SOC UI Dashboard & AI Copilot          │
└──────────────────────────────────────────────┘
```

---

## 2. Sequence Diagrams

### Log Ingestion & Processing Flow

```
[ Firewall ] -> [ Receiver ]: Raw Syslog Packet
[ Receiver ] -> [ Collector Plugin ]: parse() & normalize()
[ Collector Plugin ] -> [ Redis Stream ]: produce(normalizedLog)
[ Redis Consumer ] -> [ GeoIP / ThreatIntel ]: enrich(log)
[ Redis Consumer ] -> [ Sigma Engine ]: evaluateLog(log)
[ Redis Consumer ] -> [ PostgreSQL Repository ]: createMany(batch)
[ Redis Consumer ] -> [ OpenSearch Service ]: bulkIndexLogs(batch)
[ Redis Consumer ] -> [ Socket.IO Server ]: broadcastLog(log)
```

---

## 3. Entity-Relationship (ER) Schema Overview

- **`Organization`** `1:N` **`Site`** `1:N` **`Device`**
- **`Organization`** `1:N` **`User`** `1:N` **`Session`**
- **`Device`** `1:N` **`FirewallLog`**
- **`AlertRule`** `1:N` **`Alert`** `1:N` **`Incident`** `1:N` **`Case`** `1:N` **`Evidence`** / **`Comment`**
