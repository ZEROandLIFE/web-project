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
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)(); // 内存存储，用于处理文件上传
const router = express_1.default.Router();
// 用户注册 - 处理multipart/form-data
router.post('/register', upload.single('avatar'), registerController_1.default.register);
// 用户登录
router.post('/login', loginController_1.default.login);
router.get('/current', auth_1.authenticate, userController_1.getCurrentUser);
exports.default = router;
