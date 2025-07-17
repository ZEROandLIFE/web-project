"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = exports.rechargeMoney = exports.getCurrentUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const userService_1 = __importDefault(require("../services/userService"));
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
const rechargeMoney = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: '充值金额必须是一个大于0的数字' });
        }
        const newBalance = await userService_1.default.rechargeMoney(userId, amount);
        res.json({
            success: true,
            newBalance
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.rechargeMoney = rechargeMoney;
const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const balance = await userService_1.default.getUserMoney(userId);
        res.json({ balance });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getBalance = getBalance;
