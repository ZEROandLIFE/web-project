import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import UserService from '../services/userService';

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        // 从认证中间件附加的用户信息中获取ID
        const userId = (req as any).user.id;
        
        // 查询用户信息
        const user = await UserModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }

        // 排除密码字段
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({ error: '服务器错误' });
    }
};
export const rechargeMoney = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { amount } = req.body;

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: '充值金额必须是一个大于0的数字' });
        }

        const newBalance = await UserService.rechargeMoney(userId, amount);
        res.json({ 
            success: true,
            newBalance 
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

export const getBalance = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const balance = await UserService.getUserMoney(userId);
        res.json({ balance });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};