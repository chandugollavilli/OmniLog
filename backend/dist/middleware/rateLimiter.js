"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.apiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again later.' },
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20, // limit auth attempts to 20 per 15 minutes
    message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
});
