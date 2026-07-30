"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const prisma_1 = require("../database/prisma");
class DeviceService {
    static async getDevices() {
        return prisma_1.prisma.device.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    static async createDevice(data) {
        const existing = await prisma_1.prisma.device.findUnique({ where: { serialNumber: data.serialNumber } });
        if (existing) {
            throw new Error('Device with this serial number already exists.');
        }
        return prisma_1.prisma.device.create({
            data: {
                ...data,
                vdom: data.vdom || 'root',
                status: 'ONLINE',
            },
        });
    }
    static async updateDevice(id, data) {
        return prisma_1.prisma.device.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }
    static async deleteDevice(id) {
        return prisma_1.prisma.device.delete({ where: { id } });
    }
}
exports.DeviceService = DeviceService;
