"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
const port = 3000;
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
// 处理注册 POST 请求
app.post("/api/auth/register", upload.single("avatar"), (req, res) => {
    try {
        console.log("请求体（文本字段）:", req.body); // 普通表单字段
        console.log("上传的文件:", req.file); // 文件信息
        // res.json({ message: "文件上传成功", file: req.file });
        const { username, password, phone, address } = req.body;
        const avatar = req.file; // 获取上传的文件
        console.log('注册请求数据:', {
            username,
            password,
            phone,
            address,
            avatar: avatar ? avatar.originalname : '未上传',
        });
        console.log("到这了");
        // 模拟注册成功
        res.status(201).json({
            message: '注册成功',
            user: {
                username,
                phone,
                address,
                avatar: avatar ? avatar.originalname : 'default-avatar.png',
            },
        });
    }
    catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '注册失败' });
    }
});
// app.post('/api/auth/register', upload.single('avatar'), (req: Request, res: Response) => {//
//   try {
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);
//     console.log("File:", req.file);
//     const { username, password, phone, address } = req.body;
//     const avatar = req.file; // 获取上传的文件
//     console.log("到这了")
//     console.log('注册请求数据:', {
//       username,
//       password,
//       phone,
//       address,
//       avatar: avatar ? avatar.originalname : '未上传',
//     });
//     // 模拟注册成功
//     res.status(201).json({
//       message: '注册成功',
//       user: {
//         username,
//         phone,
//         address,
//         // avatar: avatar ? avatar.originalname : 'default-avatar.png',
//       },
//     });
//   } catch (error) {
//     console.error('注册错误:', error);
//     res.status(500).json({ error: '注册失败' });
//   }
// });
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
