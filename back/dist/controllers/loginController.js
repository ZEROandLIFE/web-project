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
            const loginData = { username, password };
            const result = await loginService_1.default.login(loginData);
            res.json(result);
        }
        catch (error) {
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
exports.default = new LoginController();
