import express from 'express';
import BoxController from '../controllers/boxController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer(); // 用于处理文件上传的multer实例

/**
 * 盲盒管理路由
 */

/**
 * 创建新的盲盒
 * @route POST /createbox
 * @requires auth 中间件验证
 * @consumes multipart/form-data
 * @param {file} boxAvatar - 盲盒封面图片（可选）
 */
router.post('/createbox', authenticate, upload.single('boxAvatar'), BoxController.createBox);

/**
 * 获取所有盲盒列表
 * @route GET /getallboxes
 */
router.get('/getallboxes', BoxController.getAllBoxes);

/**
 * 根据ID获取单个盲盒详情
 * @route GET /:id
 * @param {string} id - 盲盒的唯一ID
 */
router.get('/:id', BoxController.getBoxById);

/**
 * 删除指定ID的盲盒
 * @route DELETE /:id
 * @requires auth 中间件验证
 * @param {string} id - 要删除的盲盒ID
 */
router.delete('/:id', authenticate, BoxController.deleteBox);

/**
 * 购买指定ID的盲盒
 * @route POST /:id/purchase
 * @requires auth 中间件验证
 * @param {string} id - 要购买的盲盒ID
 */
router.post('/:id/purchase', authenticate, BoxController.purchaseBox);

export default router;