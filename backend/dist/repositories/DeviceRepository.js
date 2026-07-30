"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRepository = void 0;
const prisma_1 = require("../database/prisma");
class DeviceRepository {
    static async findAll(organizationId) {
        const where = {};
        if (organizationId)
            where.organizationId = organizationId;
        return prisma_1.prisma.device.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    static async findById(id) {
        return prisma_1.prisma.device.findUnique({ where: { id } });
    }
    static async findBySerial(serialNumber) {
        return prisma_1.prisma.device.findUnique({ where: { serialNumber } });
    }
    static async create(data) {
        return prisma_1.prisma.device.create({ data });
    }
    static async update(id, data) {
        return prisma_1.prisma.device.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma_1.prisma.device.delete({ where: { id } });
    }
}
exports.DeviceRepository = DeviceRepository;
