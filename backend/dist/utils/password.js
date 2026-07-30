"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordPolicy = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(12);
    return bcryptjs_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
const validatePasswordPolicy = (password) => {
    if (password.length < 8) {
        return { valid: false, reason: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, reason: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, reason: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, reason: 'Password must contain at least one number.' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { valid: false, reason: 'Password must contain at least one special character.' };
    }
    return { valid: true };
};
exports.validatePasswordPolicy = validatePasswordPolicy;
