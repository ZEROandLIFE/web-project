"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = require("../utils/bcrypt");
/**
 * 用户服务类
 * @class UserService
 * @description 处理用户账户相关业务逻辑，包括余额管理、资料更新和权限设置
 */
class UserService {
    /**
     * 获取用户当前余额
     * @async
     * @param {number} userId - 用户ID
     * @returns {Promise<number>} 用户当前余额
     */
    async getUserMoney(userId) {
        const user = await userModel_1.default.getUserById(userId);
        return user.money;
    }
    /**
     * 用户余额充值
     * @async
     * @param {number} userId - 用户ID
     * @param {number} amount - 充值金额（必须大于0）
     * @returns {Promise<number>} 充值后的账户余额
     * @throws {Error} 当充值金额不大于0时抛出异常
     */
    async rechargeMoney(userId, amount) {
        // 验证充值金额有效性
        if (amount <= 0) {
            throw new Error('充值金额必须大于0');
        }
        // 执行余额更新
        await userModel_1.default.updateMoney(userId, amount);
        // 返回最新余额
        const user = await userModel_1.default.getUserById(userId);
        return user.money;
    }
    /**
     * 用户余额消费
     * @async
     * @param {number} userId - 用户ID
     * @param {number} amount - 消费金额（必须大于0）
     * @returns {Promise<number>} 消费后的账户余额
     * @throws {Error} 当消费金额无效或余额不足时抛出异常
     */
    async consumeMoney(userId, amount) {
        // 验证消费金额有效性
        if (amount <= 0) {
            throw new Error('消费金额必须大于0');
        }
        // 检查余额充足性
        const user = await userModel_1.default.getUserById(userId);
        if (user.money < amount) {
            throw new Error('余额不足');
        }
        // 执行余额扣减（使用负值表示扣减）
        await userModel_1.default.updateMoney(userId, -amount);
        // 返回最新余额
        const updatedUser = await userModel_1.default.getUserById(userId);
        return updatedUser.money;
    }
    /**
     * 更新用户资料
     * @async
     * @param {number} userId - 用户ID
     * @param {Object} profileData - 要更新的用户资料
     * @param {string} [profileData.username] - 新用户名（可选）
     * @param {string} [profileData.address] - 新地址（可选）
     * @returns {Promise<User>} 更新后的用户完整信息
     * @throws {Error} 当用户名已存在时抛出异常
     */
    async updateProfile(userId, profileData) {
        // 验证用户名唯一性（如果需要更新用户名）
        if (profileData.username) {
            const existingUser = await userModel_1.default.getUserByUsername(profileData.username);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('用户名已存在');
            }
        }
        // 执行资料更新
        await userModel_1.default.updateProfile(userId, profileData);
        // 返回更新后的完整用户信息
        return userModel_1.default.getUserById(userId);
    }
    /**
     * 修改用户密码
     * @async
     * @param {number} userId - 用户ID
     * @param {string} newPassword - 新密码（将自动加密存储）
     * @returns {Promise<void>} 无返回值
     */
    async changePassword(userId, newPassword) {
        // 加密新密码并存储
        const hashedPassword = await (0, bcrypt_1.hashPassword)(newPassword);
        await userModel_1.default.changePassword(userId, hashedPassword);
    }
    /**
     * 设置用户为管理员权限
     * @async
     * @param {number} userId - 用户ID
     * @returns {Promise<User>} 更新后的用户完整信息
     */
    async setAdminRole(userId) {
        const role = 'admin';
        // 更新用户角色
        await userModel_1.default.setUserRole(userId, role);
        // 返回更新后的用户信息
        return userModel_1.default.getUserById(userId);
    }
}
exports.default = new UserService();
