import { Request, Response } from 'express';
import LoginService from '../services/loginService';

class LoginController {
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const loginResult = await LoginService.login({ username, password });
            
            // 确保返回的token包含用户ID
            res.json({
                token: loginResult.token,
                user: {
                    id: loginResult.user.id,
                    username: loginResult.user.username,
                    phone: loginResult.user.phone,
                    avatar: loginResult.user.avatar || 'default-avatar.png'
                }
            });
        } catch (error: any) {
            console.error('登录错误:', error);
            if (error.message === '用户不存在' || error.message === '密码错误') {
                res.status(401).json({ error: error.message });
            } else {
                res.status(500).json({ error: '登录失败' });
            }
        }
    }
}

export default new LoginController();