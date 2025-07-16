"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registerService_1 = __importDefault(require("../services/registerService"));
class RegisterController {
    async register(req, res) {
        try {
            const { username, password, phone, address } = req.body;
            const avatar = req.file;
            const userData = {
                username,
                password,
                phone,
                address,
                avatar: avatar ? avatar.buffer.toString('base64') : undefined
            };
            const user = await registerService_1.default.register(userData);
            res.status(201).json({
                message: '注册成功',
                user: {
                    username: user.username,
                    phone: user.phone,
                    address: user.address,
                    avatar: user.avatar || 'default-avatar.png'
                }
            });
        }
        catch (error) {
            console.error('注册错误:', error);
            if (error.message === 'Username already exists' || error.message === 'Phone number already exists') {
                res.status(409).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: '注册失败' });
            }
        }
    }
}
exports.default = new RegisterController();
