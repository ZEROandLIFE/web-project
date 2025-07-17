"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = require("../utils/bcrypt");
class UserService {
    // 获取用户余额
    async getUserMoney(userId) {
        const user = await userModel_1.default.getUserById(userId);
        return user.money;
    }
    // 充值余额
    async rechargeMoney(userId, amount) {
        // 验证充值金额
        if (amount <= 0) {
            throw new Error('充值金额必须大于0');
        }
        // 更新余额
        await userModel_1.default.updateMoney(userId, amount);
        // 返回更新后的余额
        const user = await userModel_1.default.getUserById(userId);
        return user.money;
    }
    // 消费余额
    async consumeMoney(userId, amount) {
        // 验证消费金额
        if (amount <= 0) {
            throw new Error('消费金额必须大于0');
        }
        // 检查余额是否足够
        const user = await userModel_1.default.getUserById(userId);
        if (user.money < amount) {
            throw new Error('余额不足');
        }
        // 更新余额
        await userModel_1.default.updateMoney(userId, -amount);
        // 返回更新后的余额
        const updatedUser = await userModel_1.default.getUserById(userId);
        return updatedUser.money;
    }
    async updateProfile(userId, profileData) {
        // 验证用户名是否已存在
        if (profileData.username) {
            const existingUser = await userModel_1.default.getUserByUsername(profileData.username);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('用户名已存在');
            }
        }
        // 更新用户信息
        await userModel_1.default.updateProfile(userId, profileData);
        // 返回更新后的用户信息
        return userModel_1.default.getUserById(userId);
    }
    // 修改密码
    async changePassword(userId, newPassword) {
        const hashedPassword = await (0, bcrypt_1.hashPassword)(newPassword);
        await userModel_1.default.changePassword(userId, hashedPassword);
    }
}
exports.default = new UserService();
