# Changelog

All notable changes to OmniLog will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-30

### Added
- **Multi-Transport Syslog Receiver**: Continuous UDP 514/5140, TCP 514/5140, and TLS 6514 ingestion listeners.
- **Collector Plugin Architecture**: `BaseCollector` and `CollectorRegistry` supporting FortiGate, Palo Alto, Cisco, and Linux.
- **Redis Stream Pipeline**: Async stream queuing (`omnilog:stream:logs`), worker groups, retry queues, and dead-letter queues (`omnilog:dlq`).
- **OpenSearch Dual Storage**: Automated template creation, index lifecycle aliases, and bulk search indexers.
- **GeoIP & Threat Intel Enrichment**: Country, City, ASN, Latitude, Longitude, and AbuseIPDB/AlienVault OTX IOC lookup.
- **MITRE ATT&CK & Sigma Rules Engine**: Tactic/technique mapping and YAML Sigma detection signature evaluator.
- **SOAR Automated Playbooks**: Automated workflow execution (Auto-Block IP, Disable VPN User, Notify Teams/Slack).
- **Incident & Case Management**: Triage board, analyst assignment, SLA clocks, and timeline evidence tracking.
- **AI Security Copilot V3**: Natural Language to SQL/OpenSearch DSL query generator and incident timeline summarizer.
- **Enterprise React SOC UI**: Dark/Light mode, live stream viewer, interactive Apache ECharts, and Geographical attack maps.
- **Kubernetes & Helm Deployment**: Production deployment manifests, StatefulSets, readiness/liveness probes, and Helm chart.
