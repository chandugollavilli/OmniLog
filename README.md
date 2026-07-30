# OmniLog V3 - Open-Source Enterprise FortiAnalyzer, SIEM, & SOAR Platform

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Docker Pulls](https://img.shields.io/badge/Docker-v1.0.0-blue)](docker-compose.yml)
[![Version](https://img.shields.io/badge/Version-v1.0.0-orange)](CHANGELOG.md)

OmniLog V3 is an open-source enterprise Log Management, SIEM, and SOAR Platform designed to ingest, analyze, report, and visualize firewall telemetry from FortiGate, Palo Alto, Cisco, Linux, and custom collectors.

---

## 🌟 Key Features

- 🚀 **High Throughput Syslog Receiver**: Supports continuous Syslog ingestion on UDP 514/5140, TCP 514/5140, and TLS 6514.
- 🔌 **Plugin Collector Architecture**: Extensible `BaseCollector` and `CollectorRegistry` supporting FortiGate, Palo Alto, Cisco, and Linux.
- ⚡ **Redis Stream Pipeline**: Scales to 25,000+ logs/sec with fault-tolerant worker consumer groups and dead-letter queues.
- 🔍 **OpenSearch Dual Storage**: Automated index template creation (`omnilog-logs-template`), monthly index rotation (`omnilog-logs-YYYY.MM`), and sub-second full-text query builder.
- 🌍 **GeoIP & Threat Intel**: MaxMind IP resolution (Country, City, ASN, Lat/Long) and AbuseIPDB / AlienVault OTX IOC threat matching.
- 🎯 **MITRE ATT&CK & Sigma Engine**: YAML Sigma detection rule evaluator and framework technique coverage matrix.
- ⚡ **SOAR Automated Playbooks**: Execute automated security playbooks (Auto-Block IP, Disable VPN User, Notify Teams/Slack).
- 🤖 **AI Security Copilot V3**: Natural language security query engine, MITRE technique explanations, and threat timeline summarizer.
- 📊 **Enterprise SOC UI**: Built with React 18, Socket.IO, TailwindCSS, and Apache ECharts.

---

## 📁 Repository Structure

```
/home/yal2603s/Desktop/log/
├── LICENSE                     # Apache 2.0 Open Source License
├── CONTRIBUTING.md              # Developer contribution guidelines
├── CODE_OF_CONDUCT.md          # Contributor Covenant Code of Conduct
├── SECURITY.md                 # Security vulnerability disclosure policy
├── CHANGELOG.md                # Release history & v1.0.0 release notes
├── docs/                       # Comprehensive documentation suite
│   ├── ARCHITECTURE.md          # Diagrams, sequence flows, ER diagram
│   ├── ADMINISTRATOR_GUIDE.md   # Deployment, user management, configuration
│   ├── SOC_ANALYST_GUIDE.md     # Incident management & threat hunting
│   ├── API_DOCUMENTATION.md     # REST API reference & WebSockets
│   ├── PLUGIN_DEVELOPMENT_GUIDE.md # Creating custom collector plugins
│   ├── TROUBLESHOOTING_FAQ.md   # FAQ & Troubleshooting
│   └── MARKETING_PRODUCT_HUNT_KIT.md # Product Hunt launch, pricing, whitepaper
├── k8s/                        # Kubernetes manifests & Helm chart
└── backend/ & frontend/        # Complete backend & React source code
```

---

## 🚀 Quick Start Guide

### Deploy with Docker Compose
```bash
git clone https://github.com/omnilog/omnilog.git
cd omnilog
cp .env.example .env
docker-compose up -d --build
```

Access the UI at `http://localhost:3000` with default credentials:
- **Email**: `admin@omnilog.local`
- **Password**: `AdminPassword123!`

---

## 📖 Complete Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [Administrator Guide](docs/ADMINISTRATOR_GUIDE.md)
- [SOC Analyst Guide](docs/SOC_ANALYST_GUIDE.md)
- [API Reference](docs/API_DOCUMENTATION.md)
- [Plugin Development Guide](docs/PLUGIN_DEVELOPMENT_GUIDE.md)
- [Troubleshooting & FAQ](docs/TROUBLESHOOTING_FAQ.md)
- [Product Launch Kit & Pricing](docs/MARKETING_PRODUCT_HUNT_KIT.md)

---

## 🛡️ License

OmniLog is licensed under the [Apache 2.0 License](LICENSE).
