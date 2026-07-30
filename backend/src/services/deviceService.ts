import { prisma } from '../database/prisma';

export class DeviceService {
  static async getDevices() {
    return prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createDevice(data: {
    name: string;
    serialNumber: string;
    ipAddress: string;
    model: string;
    firmwareVersion: string;
    vdom?: string;
    location?: string;
  }) {
    const existing = await prisma.device.findUnique({ where: { serialNumber: data.serialNumber } });
    if (existing) {
      throw new Error('Device with this serial number already exists.');
    }

    return prisma.device.create({
      data: {
        ...data,
        vdom: data.vdom || 'root',
        status: 'ONLINE',
      },
    });
  }

  static async updateDevice(id: string, data: Partial<{
    name: string;
    ipAddress: string;
    model: string;
    firmwareVersion: string;
    vdom: string;
    location: string;
    status: string;
  }>) {
    return prisma.device.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  static async deleteDevice(id: string) {
    return prisma.device.delete({ where: { id } });
  }
}
