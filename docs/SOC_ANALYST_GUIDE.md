# OmniLog V3 - SOC Analyst Guide

This guide assists Security Operations Center (SOC) analysts with threat hunting, incident triage, live log investigation, and AI Copilot usage.

---

## 1. Realtime Live Log Viewer

Access **Live Log Viewer** (`/live-logs`) to monitor continuous Syslog traffic streaming over WebSockets:
- Use **Pause Stream** to freeze the buffer during investigation.
- Filter by action (`accept`, `deny`, `close`).
- Click the eye icon on any row to open the **Log Detail Modal** for structured, JSON, or raw Syslog string inspection.

---

## 2. SOC Incident Board & Case Management

Navigate to **SOC Incident Board** (`/incidents`):
- **New Triage**: Inspect automated alerts spawned by the threat engine or Sigma rules.
- **Investigating**: Drag or update status to `INVESTIGATING` to claim ownership.
- **Resolved**: Close incident upon remediation.

---

## 3. Threat Hunting with AI Copilot

Navigate to **AI Security Copilot** (`/ai-assistant`):
Type natural language security questions such as:
- *"Show blocked traffic today"*
- *"Find brute-force attacks"*
- *"Summarize VPN activity"*
- *"Find top attackers"*
