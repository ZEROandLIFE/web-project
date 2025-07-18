"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registerService_1 = __importDefault(require("../services/registerService"));
const imageService_1 = __importDefault(require("../services/imageService"));
class RegisterController {
    async register(req, res) {
        try {
            const { username, password, phone, address } = req.body;
            const avatar = req.file; // 获取上传的文件
            let avatarUrl = 'default-avatar.png';
            if (avatar) {
                avatarUrl = await imageService_1.default.uploadImage(req); // 使用 ImageService 上传图片
            }
            const newUser = await registerService_1.default.register({
                username,
                password,
                phone,
                address,
                avatar: avatar ? avatarUrl : undefined
            });
            // 返回
            res.status(201).json({
                message: '注册成功',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    phone: newUser.phone,
                    address: newUser.address,
                    avatar: newUser.avatar || 'default-avatar.png'
                }
            });
        }
        catch (error) {
            console.error('注册错误:', error);
            // 根据错误类型返回不同的状态码
            if (error.message === 'Username already exists') {
                res.status(409).json({ error: '用户名已存在' });
            }
            else if (error.message === 'Phone number already exists') {
                res.status(409).json({ error: '手机号已注册' });
            }
            else {
                res.status(500).json({ error: '注册失败' });
            }
            res.status(500).json({ error: '注册失败' });
        }
    }
}
exports.default = new RegisterController();
