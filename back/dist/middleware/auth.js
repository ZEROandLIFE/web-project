"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
async function authenticate(req, res, next) {
    try {
        // 1. 检查 Authorization 头
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        // 2. 验证 JWT 并提取 userId
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded?.userId) {
            return res.status(401).json({ error: 'Invalid token: missing userId' });
        }
        // 3. 查询用户信息
        const user = await userModel_1.default.getUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // 4. 附加用户信息到请求对象
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        // 5. 更精细的错误处理
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(500).json({ error: 'Authentication failed' });
    }
}
