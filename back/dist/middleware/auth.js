"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const JWT_SECRET = process.env.JWT_SECRET || '3f786850e387550fdab836ed7e6dc881de23001b8e6e1b4c3d6e2c1b1a0d8c4f9a7b6c5d4e3f2g1h0i9j8k7l6m5n4o3p2q1r0s9t8u7v6w5x4y3z2';
// 验证用户是否已登录
async function authenticate(req, res, next) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Authentication required');
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await user_1.default.getUserById(decoded.id);
        if (!user) {
            throw new Error('User not found');
        }
        // 将用户信息添加到请求对象中
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
}
// 验证用户角色 (如果需要)
function authorize(roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        next();
    };
}
