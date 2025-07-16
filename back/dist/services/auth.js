"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("../utils/bcrypt");
class AuthService {
    async register(userData) {
        const { username, phone, password } = userData;
        // 检查用户名是否已存在
        const existingUser = await user_1.default.getUserByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }
        // 检查手机号是否已存在
        const existingPhone = await user_1.default.getUserByPhone(phone);
        if (existingPhone) {
            throw new Error('Phone number already exists');
        }
        // 加密密码
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        // 创建用户
        return user_1.default.createUser({
            ...userData,
            password: hashedPassword
        });
    }
}
exports.default = new AuthService();
