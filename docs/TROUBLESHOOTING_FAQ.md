# OmniLog V3 - Troubleshooting & FAQ Guide

---

## 1. Frequently Asked Questions (FAQ)

### Q: Why are my FortiGate logs not appearing in the Live Viewer?
**A**:
1. Check that Syslog forwarding on FortiGate points to the host IP and port `5140` (or `514` when running in Docker container).
2. Ensure UDP/TCP port 5140 is open in host firewall (`sudo ufw allow 5140/udp`).
3. Verify backend logs (`docker logs omnilog-backend`).

### Q: How do I default admin credentials?
**A**: Default user is `admin@omnilog.local` and password is `AdminPassword123!`. You can change this on **Users Page**.

---

## 2. Common Troubleshooting Steps

### Connection refused on Syslog UDP 514
Ports below 1024 require root privileges on Linux. When running natively without root, use port `5140`. Docker maps host port `514` to container port `5140` seamlessly.

### Database Connection Timeout
Ensure PostgreSQL container is running (`docker-compose ps`) and healthcheck succeeds.
