"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const getCurrentUser = async (req, res) => {
    try {
        // 从认证中间件附加的用户信息中获取ID
        const userId = req.user.id;
        // 查询用户信息
        const user = await userModel_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        // 排除密码字段
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    }
    catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({ error: '服务器错误' });
    }
};
exports.getCurrentUser = getCurrentUser;
