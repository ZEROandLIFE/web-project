"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginService_1 = __importDefault(require("../services/loginService"));
/**
 * 用户登录控制器，处理用户认证相关请求
 */
class LoginController {
    /**
     * 用户登录方法
     * @param req 请求对象，包含用户名和密码
     * @param res 响应对象，返回认证token和用户信息
     * @response 200 登录成功，返回token和用户信息
     * @response 401 认证失败，用户不存在或密码错误
     * @response 500 服务器内部错误
     */
    async login(req, res) {
        try {
            // 从请求体中解构出用户名和密码
            const { username, password } = req.body;
            // 调用服务层进行登录认证
            const loginResult = await loginService_1.default.login({ username, password });
            // 构造响应数据，处理默认头像情况
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
            // 根据错误类型返回不同的HTTP状态码
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
