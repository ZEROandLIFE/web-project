import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        // 1. 检查 Authorization 头
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        
        // 2. 验证 JWT 并提取 userId
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }; 
        
        if (!decoded?.userId) {
            return res.status(401).json({ error: 'Invalid token: missing userId' });
        }

        // 3. 查询用户信息
        const user = await UserModel.getUserById(decoded.userId); 
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 4. 附加用户信息到请求对象
        (req as any).user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        // 5. 更精细的错误处理
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }
        
        return res.status(500).json({ error: 'Authentication failed' });
    }
}