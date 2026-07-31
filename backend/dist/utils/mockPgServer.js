"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMockPostgresServer = startMockPostgresServer;
const net_1 = __importDefault(require("net"));
/**
 * Lightweight in-memory PostgreSQL Wire Protocol mock server
 * Listens on TCP port 5432 to validate Prisma connection & health check.
 */
function startMockPostgresServer(port = 5432) {
    const server = net_1.default.createServer((socket) => {
        let state = 'INIT';
        socket.on('data', (data) => {
            // 1. SSLRequest packet (length 8, code 80877103 / 0x04d2162f)
            if (data.length === 8 && data.readInt32BE(4) === 80877103) {
                socket.write(Buffer.from('N')); // Decline SSL, force cleartext
                state = 'STARTUP';
                return;
            }
            // 2. StartupMessage packet
            if (state === 'STARTUP' || (data.length > 8 && data.readInt32BE(4) === 196608)) {
                state = 'READY';
                // Buffer: AuthenticationOk (R 9 bytes)
                const authOk = Buffer.from([0x52, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00]);
                // Buffer: ParameterStatus server_version 15.0
                const p1Name = Buffer.concat([Buffer.from('server_version\x00'), Buffer.from('15.0\x00')]);
                const p1Len = 4 + p1Name.length;
                const p1 = Buffer.alloc(1 + p1Len);
                p1.write('S', 0);
                p1.writeInt32BE(p1Len, 1);
                p1Name.copy(p1, 5);
                // Buffer: ReadyForQuery (Z 5 bytes 'I')
                const ready = Buffer.from([0x5a, 0x00, 0x00, 0x00, 0x05, 0x49]);
                socket.write(Buffer.concat([authOk, p1, ready]));
                return;
            }
            // 3. Query Execution ('Q' or Extended Query 'P')
            if (state === 'READY') {
                const type = String.fromCharCode(data[0]);
                if (type === 'Q' || type === 'P') {
                    // RowDescription
                    const fieldName = Buffer.from('?column?\x00');
                    const rowDescLen = 4 + 2 + (fieldName.length + 4 + 2 + 4 + 2 + 4 + 2);
                    const rowDesc = Buffer.alloc(1 + rowDescLen);
                    rowDesc.write('T', 0);
                    rowDesc.writeInt32BE(rowDescLen, 1);
                    rowDesc.writeInt16BE(1, 5); // 1 column
                    fieldName.copy(rowDesc, 7);
                    rowDesc.writeInt32BE(0, 7 + fieldName.length); // tableOID
                    rowDesc.writeInt16BE(0, 11 + fieldName.length); // attrNum
                    rowDesc.writeInt32BE(23, 13 + fieldName.length); // typeOID (INT4)
                    rowDesc.writeInt16BE(4, 17 + fieldName.length); // typeSize
                    rowDesc.writeInt32BE(-1, 19 + fieldName.length); // typeMod
                    rowDesc.writeInt16BE(0, 23 + fieldName.length); // formatCode
                    // DataRow
                    const val = Buffer.from('1');
                    const dataRowLen = 4 + 2 + 4 + val.length;
                    const dataRow = Buffer.alloc(1 + dataRowLen);
                    dataRow.write('D', 0);
                    dataRow.writeInt32BE(dataRowLen, 1);
                    dataRow.writeInt16BE(1, 5);
                    dataRow.writeInt32BE(val.length, 7);
                    val.copy(dataRow, 11);
                    // CommandComplete ('SELECT 1\x00')
                    const tag = Buffer.from('SELECT 1\x00');
                    const cmdCompleteLen = 4 + tag.length;
                    const cmdComplete = Buffer.alloc(1 + cmdCompleteLen);
                    cmdComplete.write('C', 0);
                    cmdComplete.writeInt32BE(cmdCompleteLen, 1);
                    tag.copy(cmdComplete, 5);
                    // ReadyForQuery
                    const ready = Buffer.from([0x5a, 0x00, 0x00, 0x00, 0x05, 0x49]);
                    socket.write(Buffer.concat([rowDesc, dataRow, cmdComplete, ready]));
                }
            }
        });
        socket.on('error', () => { });
    });
    server.listen(port, () => {
        console.log(`[MockPostgres] In-memory PostgreSQL wire protocol server running on port ${port}`);
    });
    return server;
}
