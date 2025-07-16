"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = __importDefault(require("../controllers/registerController"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)(); // 内存存储，用于处理文件上传
const router = express_1.default.Router();
// 用户注册 - 处理multipart/form-data
router.post('/register', upload.single('avatar'), registerController_1.default.register);
exports.default = router;
