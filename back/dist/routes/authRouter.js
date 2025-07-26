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
// 用户注册 - 处理multipart/form-data
router.post('/register', upload.single('avatar'), registerController_1.default.register);
// 用户登录
router.post('/login', loginController_1.default.login);
router.get('/current', auth_1.authenticate, userController_1.getCurrentUser);
// 用户余额相关路由
router.post('/recharge', auth_1.authenticate, userController_2.rechargeMoney);
router.get('/balance', auth_1.authenticate, userController_2.getBalance);
// 更新个人信息
router.put('/profile', auth_1.authenticate, userController_2.updateProfile);
// 修改密码
router.put('/password', auth_1.authenticate, userController_2.changePassword);
router.put('/admin/:userId', auth_1.authenticate, userController_3.setAdminRole);
exports.default = router;
