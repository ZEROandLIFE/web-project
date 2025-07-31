import UserModel from '../models/userModel';
import { User } from '../types/register';
import { hashPassword } from '../utils/bcrypt';

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
    async getUserMoney(userId: number): Promise<number> {
        const user = await UserModel.getUserById(userId);
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
    async rechargeMoney(userId: number, amount: number): Promise<number> {
        // 验证充值金额有效性
        if (amount <= 0) {
            throw new Error('充值金额必须大于0');
        }

        // 执行余额更新
        await UserModel.updateMoney(userId, amount);
        
        // 返回最新余额
        const user = await UserModel.getUserById(userId);
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
    async consumeMoney(userId: number, amount: number): Promise<number> {
        // 验证消费金额有效性
        if (amount <= 0) {
            throw new Error('消费金额必须大于0');
        }

        // 检查余额充足性
        const user = await UserModel.getUserById(userId);
        if (user.money < amount) {
            throw new Error('余额不足');
        }

        // 执行余额扣减（使用负值表示扣减）
        await UserModel.updateMoney(userId, -amount);
        
        // 返回最新余额
        const updatedUser = await UserModel.getUserById(userId);
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
    async updateProfile(userId: number, profileData: {
        username?: string;
        address?: string;
    }): Promise<User> {
        // 验证用户名唯一性（如果需要更新用户名）
        if (profileData.username) {
            const existingUser = await UserModel.getUserByUsername(profileData.username);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('用户名已存在');
            }
        }

        // 执行资料更新
        await UserModel.updateProfile(userId, profileData);
        
        // 返回更新后的完整用户信息
        return UserModel.getUserById(userId);
    }

    /**
     * 修改用户密码
     * @async
     * @param {number} userId - 用户ID
     * @param {string} newPassword - 新密码（将自动加密存储）
     * @returns {Promise<void>} 无返回值
     */
    async changePassword(userId: number, newPassword: string): Promise<void> {
        // 加密新密码并存储
        const hashedPassword = await hashPassword(newPassword);
        await UserModel.changePassword(userId, hashedPassword);
    }

    /**
     * 设置用户为管理员权限
     * @async
     * @param {number} userId - 用户ID
     * @returns {Promise<User>} 更新后的用户完整信息
     */
    async setAdminRole(userId: number): Promise<User> {
        const role = 'admin';
        // 更新用户角色
        await UserModel.setUserRole(userId, role);
        // 返回更新后的用户信息
        return UserModel.getUserById(userId);
    }
}

export default new UserService();