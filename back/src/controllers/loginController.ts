import { Request, Response } from 'express';
import LoginService from '../services/loginService';
import { LoginInput } from '../types/login';

class LoginController {
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            
            const loginData: LoginInput = { username, password };
            const result = await LoginService.login(loginData);
            
            res.json(result);
        } catch (error: any) {
            console.error('登录错误:', error);
            let message = '登录失败';
            let status = 500;
            
            if (error.message === '用户不存在' || error.message === '密码错误') {
                message = error.message;
                status = 401;
            }
            
            res.status(status).json({ error: message });
        }
    }
}

export default new LoginController();