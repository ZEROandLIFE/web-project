"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = __importDefault(require("../controllers/registerController"));
const loginController_1 = __importDefault(require("../controllers/loginController"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const userController_2 = require("../controllers/userController");
const userController_3 = require("../controllers/userController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)(); // 内存存储，用于处理文件上传
const router = express_1.default.Router();
/**
 * 用户认证相关路由
 */
/**
 * 用户注册
 * @route POST /register
 * @consumes multipart/form-data
 * @param {file} avatar - 用户头像文件（可选）
 */
router.post('/register', upload.single('avatar'), registerController_1.default.register);
/**
 * 用户登录
 * @route POST /login
 */
router.post('/login', loginController_1.default.login);
/**
 * 获取当前登录用户信息
 * @route GET /current
 * @requires auth 中间件验证
 */
router.get('/current', auth_1.authenticate, userController_1.getCurrentUser);
/**
 * 用户账户相关路由
 */
/**
 * 用户充值
 * @route POST /recharge
 * @requires auth 中间件验证
 */
router.post('/recharge', auth_1.authenticate, userController_2.rechargeMoney);
/**
 * 获取用户余额
 * @route GET /balance
 * @requires auth 中间件验证
 */
router.get('/balance', auth_1.authenticate, userController_2.getBalance);
/**
 * 更新用户资料
 * @route PUT /profile
 * @requires auth 中间件验证
 */
router.put('/profile', auth_1.authenticate, userController_2.updateProfile);
/**
 * 修改用户密码
 * @route PUT /password
 * @requires auth 中间件验证
 */
router.put('/password', auth_1.authenticate, userController_2.changePassword);
/**
 * 管理员相关路由
 */
/**
 * 设置用户为管理员
 * @route PUT /admin/:userId
 * @requires auth 中间件验证
 * @param {string} userId - 要设置管理员权限的用户ID
 */
router.put('/admin/:userId', auth_1.authenticate, userController_3.setAdminRole);
exports.default = router;
