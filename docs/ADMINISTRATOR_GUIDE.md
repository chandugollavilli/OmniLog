# OmniLog V3 - Administrator Guide

This guide provides system administrators with deployment, configuration, user management, and infrastructure maintenance instructions.

---

## 1. System Requirements

### Production Hardware Recommendations
- **CPU**: 16 vCPUs
- **RAM**: 32 GB RAM
- **Storage**: 1 TB NVMe SSD
- **OS**: Ubuntu 22.04 LTS / Debian 12 / RHEL 9

---

## 2. Deployment Instructions

### Docker Compose Deployment
```bash
cp .env.example .env
docker-compose up -d --build
```

### Kubernetes Deployment
```bash
kubectl apply -f k8s/omnilog-deployment.yaml -n omnilog
```

---

## 3. User & Role Management (RBAC)

OmniLog enforces 4 role levels:
1. **ADMINISTRATOR**: Full access to devices, users, alert rules, settings, and SOAR playbooks.
2. **SOC_ANALYST**: Can manage incidents, cases, trigger manual reports, and acknowledge security alerts.
3. **AUDITOR**: Read-only compliance access to audit trails, reports, and search.
4. **VIEWER**: Dashboard viewing rights only.

To register a new user:
Navigate to **Users Page** -> **Create User Account**. Fill in Email, Username, Password, and Role.
