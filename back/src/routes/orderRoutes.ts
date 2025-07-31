// routes/orderRoutes.ts
import express from 'express';
import { authenticate } from '../middleware/auth';
import * as orderController from '../controllers/orderController';

const router = express.Router();

/**
 * 订单管理路由
 */

/**
 * 获取当前用户的所有订单
 * @route GET /my
 * @requires auth 中间件验证
 * @access 登录用户
 */
router.get('/my', authenticate, orderController.getUserOrders);

/**
 * 获取当前用户作为卖家的所有订单
 * @route GET /seller
 * @requires auth 中间件验证
 * @access 登录用户
 */
router.get('/seller', authenticate, orderController.getSellerOrders);

/**
 * 获取当前用户作为买家的所有订单
 * @route GET /buyer
 * @requires auth 中间件验证
 * @access 登录用户
 */
router.get('/buyer', authenticate, orderController.getBuyerOrders);

/**
 * 管理员获取系统所有订单（需要管理员权限）
 * @route GET /admin/all
 * @requires auth 中间件验证
 * @access 管理员
 */
router.get('/admin/all', authenticate, orderController.getAdminAllOrders);

/**
 * 获取订单统计信息（需要管理员权限）
 * @route GET /admin/stats
 * @requires auth 中间件验证
 * @access 管理员
 */
router.get('/admin/stats', authenticate, orderController.getOrderStats);

export default router;