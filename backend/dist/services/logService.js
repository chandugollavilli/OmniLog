"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const prisma_1 = require("../database/prisma");
class LogService {
    static async getLogs(query) {
        const page = Math.max(1, query.page || 1);
        const limit = Math.min(500, Math.max(1, query.limit || 50));
        const skip = (page - 1) * limit;
        const where = {};
        if (query.ip) {
            where.OR = [{ srcip: query.ip }, { dstip: query.ip }];
        }
        if (query.user)
            where.user = { contains: query.user, mode: 'insensitive' };
        if (query.country) {
            where.OR = [
                { srccountry: { contains: query.country, mode: 'insensitive' } },
                { dstcountry: { contains: query.country, mode: 'insensitive' } },
            ];
        }
        if (query.app)
            where.app = { contains: query.app, mode: 'insensitive' };
        if (query.policyid)
            where.policyid = query.policyid;
        if (query.proto)
            where.proto = query.proto;
        if (query.level)
            where.level = query.level;
        if (query.action)
            where.action = query.action;
        if (query.devname)
            where.devname = query.devname;
        if (query.service)
            where.service = { contains: query.service, mode: 'insensitive' };
        if (query.startDate || query.endDate) {
            where.timestamp = {};
            if (query.startDate)
                where.timestamp.gte = new Date(query.startDate);
            if (query.endDate)
                where.timestamp.lte = new Date(query.endDate);
        }
        if (query.search) {
            where.OR = [
                { srcip: { contains: query.search } },
                { dstip: { contains: query.search } },
                { user: { contains: query.search, mode: 'insensitive' } },
                { app: { contains: query.search, mode: 'insensitive' } },
                { msg: { contains: query.search, mode: 'insensitive' } },
                { raw: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [total, logs] = await Promise.all([
            prisma_1.prisma.firewallLog.count({ where }),
            prisma_1.prisma.firewallLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { timestamp: 'desc' },
            }),
        ]);
        // Format BigInt fields for JSON safety
        const formattedLogs = logs.map((log) => ({
            ...log,
            sentbyte: log.sentbyte ? log.sentbyte.toString() : '0',
            rcvdbyte: log.rcvdbyte ? log.rcvdbyte.toString() : '0',
            sessionid: log.sessionid ? log.sessionid.toString() : '0',
        }));
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            logs: formattedLogs,
        };
    }
    static async getLogById(id) {
        const log = await prisma_1.prisma.firewallLog.findUnique({ where: { id } });
        if (!log)
            return null;
        return {
            ...log,
            sentbyte: log.sentbyte ? log.sentbyte.toString() : '0',
            rcvdbyte: log.rcvdbyte ? log.rcvdbyte.toString() : '0',
            sessionid: log.sessionid ? log.sessionid.toString() : '0',
        };
    }
}
exports.LogService = LogService;
