// routes/orderRoutes.ts
import express from 'express';
import { authenticate } from '../middleware/auth';
import OrderService from '../services/orderService';

const router = express.Router();

// 获取用户所有订单
router.get('/my', authenticate, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const orders = await OrderService.getUserOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 获取用户作为卖家的订单
router.get('/seller', authenticate, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const orders = await OrderService.getSellerOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 获取用户作为买家的订单
router.get('/buyer', authenticate, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const orders = await OrderService.getBuyerOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;