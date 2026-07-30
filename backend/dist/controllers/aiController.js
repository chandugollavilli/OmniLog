"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const aiService_1 = require("../services/aiService");
class AIController {
    static async queryAssistant(req, res) {
        try {
            const { prompt } = req.body;
            if (!prompt) {
                return res.status(400).json({ error: 'Prompt query is required.' });
            }
            const result = await aiService_1.AIService.querySecurityAssistant(prompt);
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.AIController = AIController;
