// routes/orderRoutes.ts
import express from 'express';
import { authenticate } from '../middleware/auth';
import * as orderController from '../controllers/orderController';

const router = express.Router();

// 获取用户所有订单
router.get('/my', authenticate, orderController.getUserOrders);

// 获取用户作为卖家的订单
router.get('/seller', authenticate, orderController.getSellerOrders);

// 获取用户作为买家的订单
router.get('/buyer', authenticate, orderController.getBuyerOrders);

// 管理员获取所有订单
router.get('/admin/all', authenticate, orderController.getAdminAllOrders);

// 订单统计接口
router.get('/admin/stats', authenticate, orderController.getOrderStats);

export default router;