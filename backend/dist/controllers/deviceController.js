"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceController = void 0;
const deviceService_1 = require("../services/deviceService");
class DeviceController {
    static async getDevices(req, res) {
        try {
            const devices = await deviceService_1.DeviceService.getDevices();
            return res.json(devices);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async createDevice(req, res) {
        try {
            const device = await deviceService_1.DeviceService.createDevice(req.body);
            return res.status(201).json(device);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async updateDevice(req, res) {
        try {
            const { id } = req.params;
            const device = await deviceService_1.DeviceService.updateDevice(id, req.body);
            return res.json(device);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async deleteDevice(req, res) {
        try {
            const { id } = req.params;
            await deviceService_1.DeviceService.deleteDevice(id);
            return res.json({ message: 'Device removed successfully.' });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.DeviceController = DeviceController;
