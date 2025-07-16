import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import 'dotenv/config'; 
import AuthService from"./services/auth"
const app = express();
const port = process.env.PORT || 3000;

// CORS 配置（允许前端访问）
app.use(cors({
  origin: 'http://localhost:5173', // 前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 解析 JSON 和表单数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 处理文件上传（使用 multer）
const upload = multer();

// 测试 GET 请求
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Backend!');
});

// 处理注册 POST 请求


app.post("/api/auth/register", upload.single("avatar"), async (req, res) => {
  try {
    const { username, password, phone, address } = req.body;
    const avatar = req.file; // 获取上传的文件
  
    const newUser = await AuthService.register({
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
  catch (error:any) {
  
    console.error('注册错误:', error);
    // 根据错误类型返回不同的状态码
    if (error.message === 'Username already exists') {
      res.status(409).json({ error: '用户名已存在' });
    } else if (error.message === 'Phone number already exists') {
      res.status(409).json({ error: '手机号已注册' });
    } else {
      res.status(500).json({ error: '注册失败' });
    }
    res.status(500).json({ error: '注册失败' });
  }

});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});