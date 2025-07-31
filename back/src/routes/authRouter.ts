import express from 'express';
import RegisterController from '../controllers/registerController';
import LoginController from '../controllers/loginController';
import { getCurrentUser } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { rechargeMoney, getBalance, updateProfile, changePassword } from '../controllers/userController';
import { setAdminRole } from '../controllers/userController';
import multer from 'multer';

const upload = multer(); // 内存存储，用于处理文件上传
const router = express.Router();

/**
 * 用户认证相关路由
 */

/**
 * 用户注册
 * @route POST /register
 * @consumes multipart/form-data
 * @param {file} avatar - 用户头像文件（可选）
 */
router.post('/register', upload.single('avatar'), RegisterController.register);

/**
 * 用户登录
 * @route POST /login
 */
router.post('/login', LoginController.login);

/**
 * 获取当前登录用户信息
 * @route GET /current
 * @requires auth 中间件验证
 */
router.get('/current', authenticate, getCurrentUser);

/**
 * 用户账户相关路由
 */

/**
 * 用户充值
 * @route POST /recharge
 * @requires auth 中间件验证
 */
router.post('/recharge', authenticate, rechargeMoney);

/**
 * 获取用户余额
 * @route GET /balance
 * @requires auth 中间件验证
 */
router.get('/balance', authenticate, getBalance);

/**
 * 更新用户资料
 * @route PUT /profile
 * @requires auth 中间件验证
 */
router.put('/profile', authenticate, updateProfile);

/**
 * 修改用户密码
 * @route PUT /password
 * @requires auth 中间件验证
 */
router.put('/password', authenticate, changePassword);

/**
 * 管理员相关路由
 */

/**
 * 设置用户为管理员
 * @route PUT /admin/:userId
 * @requires auth 中间件验证
 * @param {string} userId - 要设置管理员权限的用户ID
 */
router.put('/admin/:userId', authenticate, setAdminRole);

export default router;