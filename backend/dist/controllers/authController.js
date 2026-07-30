"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'];
            const result = await authService_1.AuthService.login(email, password, ipAddress, userAgent);
            return res.json(result);
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
    static async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token is required.' });
            }
            const result = await authService_1.AuthService.refresh(refreshToken);
            return res.json(result);
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            if (refreshToken) {
                await authService_1.AuthService.logout(refreshToken);
            }
            return res.json({ message: 'Logged out successfully.' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
