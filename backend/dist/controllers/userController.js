"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
class UserController {
    static async getUsers(req, res) {
        try {
            const users = await userService_1.UserService.getUsers();
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async createUser(req, res) {
        try {
            const user = await userService_1.UserService.createUser(req.body);
            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await userService_1.UserService.updateUser(id, req.body);
            return res.json(user);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await userService_1.UserService.deleteUser(id);
            return res.json({ message: 'User deleted successfully.' });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
