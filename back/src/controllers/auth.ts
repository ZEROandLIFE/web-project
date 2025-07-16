import { Request, Response } from 'express';
import AuthService from '../services/auth';
import { UserInput } from '../types/user';

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { username, password, phone, address } = req.body;
            const avatar = req.file;

            const userData: UserInput = {
                username,
                password,
                phone,
                address,
                avatar: avatar ? avatar.buffer.toString('base64') : undefined
            };

            const user = await AuthService.register(userData);
            
            res.status(201).json({
                message: '注册成功',
                user: {
                    username: user.username,
                    phone: user.phone,
                    address: user.address,
                    avatar: user.avatar || 'default-avatar.png'
                }
            });
        } catch (error:any) {
            console.error('注册错误:', error);
            if (error.message === 'Username already exists' || error.message === 'Phone number already exists') {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: '注册失败' });
            }
        }
    }
}

export default new AuthController();