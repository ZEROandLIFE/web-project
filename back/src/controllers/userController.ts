// controllers/userController.ts
import { Request, Response } from 'express';
import UserModel from '../models/userModel';

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