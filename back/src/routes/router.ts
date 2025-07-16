import express from 'express';
import RegisterController from '../controllers/registerController';
import LoginController from '../controllers/loginController';
import multer from 'multer';

const upload = multer(); // 内存存储，用于处理文件上传
const router = express.Router();

// 用户注册 - 处理multipart/form-data
router.post('/register', upload.single('avatar'), RegisterController.register);
// 用户登录
router.post('/login', LoginController.login);

export default router;