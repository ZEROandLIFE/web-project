"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
class LoginService {
    async login(loginData) {
        const { username, password } = loginData;
        // 1. 检查用户是否存在
        const user = await userModel_1.default.getUserByUsername(username);
        if (!user) {
            throw new Error('用户不存在');
        }
        // 2. 验证密码
        const isMatch = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isMatch) {
            throw new Error('密码错误');
        }
        // 3. 生成token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            username: user.username
        });
        // 4. 返回响应数据
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                avatar: user.avatar
            }
        };
    }
}
exports.default = new LoginService();
