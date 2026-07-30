import { prisma } from '../database/prisma';

export class DeviceRepository {
  static async findAll(organizationId?: string) {
    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    return prisma.device.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id: string) {
    return prisma.device.findUnique({ where: { id } });
  }

  static async findBySerial(serialNumber: string) {
    return prisma.device.findUnique({ where: { serialNumber } });
  }

  static async create(data: any) {
    return prisma.device.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.device.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.device.delete({ where: { id } });
  }
}
