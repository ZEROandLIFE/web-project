// services/userService.ts
import UserModel from '../models/userModel';
import { User } from '../types/register';

class UserService {
    // 获取用户余额
    async getUserMoney(userId: number): Promise<number> {
        const user = await UserModel.getUserById(userId);
        return user.money;
    }

    // 充值余额
    async rechargeMoney(userId: number, amount: number): Promise<number> {
        // 验证充值金额
        if (amount <= 0) {
            throw new Error('充值金额必须大于0');
        }

        // 更新余额
        await UserModel.updateMoney(userId, amount);
        
        // 返回更新后的余额
        const user = await UserModel.getUserById(userId);
        return user.money;
    }

    // 消费余额
    async consumeMoney(userId: number, amount: number): Promise<number> {
        // 验证消费金额
        if (amount <= 0) {
            throw new Error('消费金额必须大于0');
        }

        // 检查余额是否足够
        const user = await UserModel.getUserById(userId);
        if (user.money < amount) {
            throw new Error('余额不足');
        }

        // 更新余额
        await UserModel.updateMoney(userId, -amount);
        
        // 返回更新后的余额
        const updatedUser = await UserModel.getUserById(userId);
        return updatedUser.money;
    }
}

export default new UserService();