"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
require("dotenv/config");
const registerService_1 = __importDefault(require("./services/registerService"));
const loginService_1 = __importDefault(require("./services/loginService"));
const userController_1 = require("./controllers/userController");
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// CORS 配置（允许前端访问）
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // 前端地址
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// 解析 JSON 和表单数据
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 处理文件上传（使用 multer）
const upload = (0, multer_1.default)();
// 测试 GET 请求
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Backend!');
});
app.get('/api/current', auth_1.authenticate, userController_1.getCurrentUser);
// 处理注册 POST 请求
app.post("/api/auth/register", upload.single("avatar"), async (req, res) => {
    try {
        const { username, password, phone, address } = req.body;
        const avatar = req.file; // 获取上传的文件
        const newUser = await registerService_1.default.register({
            username,
            password,
            phone,
            address,
            avatar: avatar ? avatar.buffer.toString('base64') : undefined
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
});
app.post("/api/auth/login", async (req, res) => {
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
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
