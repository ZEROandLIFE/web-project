"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const showController_1 = __importDefault(require("../controllers/showController"));
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)(); // 配置multer处理文件上传
/**
 * 玩家秀管理路由
 */
/**
 * 创建新玩家秀
 * @route POST /create
 * @requires auth 认证中间件
 * @consumes multipart/form-data
 * @param {file} image 玩家秀封面图片（可选）
 */
router.post('/create', auth_1.authenticate, upload.single('image'), showController_1.default.createShow);
/**
 * 获取所有玩家秀列表
 * @route GET /all
 */
router.get('/all', showController_1.default.getAllShows);
/**
 * 发表评论
 * @route POST /comment
 * @requires auth 认证中间件
 */
router.post('/comment', auth_1.authenticate, showController_1.default.createComment);
/**
 * 获取指定玩家秀的评论列表
 * @route GET /:showId/comments
 * @param {string} showId 玩家秀ID
 */
router.get('/:showId/comments', showController_1.default.getComments);
exports.default = router;
