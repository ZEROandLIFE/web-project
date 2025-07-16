import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || '3f786850e387550fdab836ed7e6dc881de23001b8e6e1b4c3d6e2c1b1a0d8c4f9a7b6c5d4e3f2g1h0i9j8k7l6m5n4o3p2q1r0s9t8u7v6w5x4y3z2';

// 验证用户是否已登录
export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Authentication required');
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        const user = await UserModel.getUserById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        // 将用户信息添加到请求对象中
        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
}

// 验证用户角色 (如果需要)
export function authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        next();
    };
}