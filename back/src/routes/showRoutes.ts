import express from 'express';
import ShowController from '../controllers/showController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer(); // 配置multer处理文件上传

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
router.post('/create', authenticate, upload.single('image'), ShowController.createShow);

/**
 * 获取所有玩家秀列表
 * @route GET /all
 */
router.get('/all', ShowController.getAllShows);

/**
 * 发表评论
 * @route POST /comment
 * @requires auth 认证中间件
 */
router.post('/comment', authenticate, ShowController.createComment);

/**
 * 获取指定玩家秀的评论列表
 * @route GET /:showId/comments
 * @param {string} showId 玩家秀ID
 */
router.get('/:showId/comments', ShowController.getComments);

export default router;