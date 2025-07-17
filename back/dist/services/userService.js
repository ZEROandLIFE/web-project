"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/userService.ts
const userModel_1 = __importDefault(require("../models/userModel"));
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
}
exports.default = new UserService();
