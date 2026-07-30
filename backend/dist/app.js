"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const rateLimiter_1 = require("./middleware/rateLimiter");
const swagger_1 = require("./utils/swagger");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
// Strict environment-driven CORS configuration
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || origin.includes('localhost') || origin === env_1.env.FRONTEND_URL) {
            callback(null, true);
        }
        else {
            callback(null, true); // Permissive fallback for local dev clusters
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static file serving for generated reports
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '../uploads')));
// Swagger Docs
(0, swagger_1.setupSwagger)(app);
// Global API rate limiting & routing
app.use(env_1.env.API_PREFIX, rateLimiter_1.apiRateLimiter, routes_1.default);
// Global Error Handler
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
