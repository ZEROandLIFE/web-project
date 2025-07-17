"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = require("../utils/bcrypt");
class RegisterService {
    async register(userData) {
        const { username, phone, password } = userData;
        // 检查用户名是否已存在
        const existingUser = await userModel_1.default.getUserByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }
        // 检查手机号是否已存在
        const existingPhone = await userModel_1.default.getUserByPhone(phone);
        if (existingPhone) {
            throw new Error('Phone number already exists');
        }
        // 加密密码
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        // 创建用户
        return userModel_1.default.createUser({
            ...userData,
            password: hashedPassword
        });
    }
}
exports.default = new RegisterService();
