# OmniLog V3 - REST API & WebSocket Documentation

Interactive Swagger documentation is available at `http://localhost:5000/api/v1/docs`.

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/login`
- **Request Body**: `{ "email": "user@domain.com", "password": "Password123!" }`
- **Response**: `{ "accessToken": "JWT...", "refreshToken": "JWT...", "user": { ... } }`

### `POST /api/v1/auth/refresh`
- **Request Body**: `{ "refreshToken": "JWT..." }`
- **Response**: `{ "accessToken": "JWT..." }`

---

## 2. Firewall Log Search Endpoints

### `GET /api/v1/logs`
- **Query Parameters**: `page`, `limit`, `search`, `ip`, `action`, `user`, `startDate`, `endDate`.
- **Response**: `{ "total": 1250, "page": 1, "totalPages": 25, "logs": [ ... ] }`

---

## 3. Incident & Alert Endpoints

### `GET /api/v1/incidents`
- **Response**: List of SOC incidents with status and assigned analysts.

### `PATCH /api/v1/incidents/:id/status`
- **Request Body**: `{ "status": "INVESTIGATING" }`

---

## 4. AI Security Copilot Endpoints

### `POST /api/v1/ai/query`
- **Request Body**: `{ "prompt": "Show blocked traffic today" }`
- **Response**: `{ "intent": "BLOCKED_TRAFFIC_SUMMARY", "summary": "...", "insights": [ ... ], "data": [ ... ] }`
