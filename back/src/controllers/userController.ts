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
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { username, address } = req.body;

        // 验证输入
        if (!username && !address) {
            return res.status(400).json({ error: '至少提供一个更新字段' });
        }

        const updatedUser = await UserService.updateProfile(userId, { username, address });
        
        // 排除密码字段
        const { password, ...userWithoutPassword } = updatedUser;
        res.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { newPassword, confirmPassword } = req.body;

        // 验证输入
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ error: '请提供新密码和确认密码' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: '两次输入的密码不一致' });
        }

        await UserService.changePassword(userId, newPassword);
        
        res.json({
            success: true,
            message: '密码已修改，请重新登录'
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};