"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginService_1 = __importDefault(require("../services/loginService"));
class LoginController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const loginResult = await loginService_1.default.login({ username, password });
            res.json({
                token: loginResult.token,
                user: {
                    id: loginResult.user.id,
                    username: loginResult.user.username,
                    phone: loginResult.user.phone,
                    avatar: loginResult.user.avatar || 'default-avatar.png'
                }
            });
        }
        catch (error) {
            console.error('登录错误:', error);
            if (error.message === '用户不存在' || error.message === '密码错误') {
                res.status(401).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: '登录失败' });
            }
        }
    }
}
exports.default = new LoginController();
