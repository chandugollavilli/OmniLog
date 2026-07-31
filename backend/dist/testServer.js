"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockPgServer_1 = require("./utils/mockPgServer");
async function runTestServer() {
    // 1. Start in-memory PostgreSQL wire protocol mock server on port 5432
    (0, mockPgServer_1.startMockPostgresServer)(5432);
    // Small delay to ensure TCP socket is open
    await new Promise((res) => setTimeout(res, 500));
    // 2. Import server engine
    require('./server');
}
runTestServer();
