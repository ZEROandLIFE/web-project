"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
// 从环境变量获取JWT密钥，默认使用开发密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
/**
 * JWT认证中间件
 * @param req Express请求对象
 * @param res Express响应对象
 * @param next 下一个中间件函数
 * @header Authorization Bearer <token>
 * @response 401 未授权或令牌无效
 * @response 404 用户不存在
 * @response 500 服务器错误
 */
async function authenticate(req, res, next) {
    try {
        // 验证Authorization头格式
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        // 提取JWT令牌
        const token = authHeader.split(' ')[1];
        // 验证并解码JWT
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded?.userId) {
            return res.status(401).json({ error: 'Invalid token: missing userId' });
        }
        // 验证用户是否存在
        const user = await userModel_1.default.getUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // 将用户信息附加到请求对象供后续中间件使用
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        // 针对不同JWT错误类型返回具体错误信息
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }
        // 默认服务器错误
        return res.status(500).json({ error: 'Authentication failed' });
    }
}
