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
// 管理员获取所有订单
router.get('/admin/all', authenticate, async (req, res) => {
    try {
        // 检查管理员权限
        if ((req as any).user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }

        const { 
            page = 1, 
            pageSize = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search = '',
            sellerId,
            buyerId,
            minPrice,
            maxPrice,
            startDate,
            endDate
        } = req.query;
        const result = await OrderService.getAdminAllOrders({
            page: Number(page),
            pageSize: Number(pageSize),
            sortBy: String(sortBy),
            sortOrder: String(sortOrder) as 'asc' | 'desc',
            search: String(search),
            sellerId: sellerId ? Number(sellerId) : undefined,
            buyerId: buyerId ? Number(buyerId) : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            startDate: startDate ? new Date(String(startDate)) : undefined,
            endDate: endDate ? new Date(String(endDate)) : undefined
        });
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 订单统计接口
router.get('/admin/stats', authenticate, async (req, res) => {
    try {
        if ((req as any).user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }

        const { period = 'day' } = req.query; // day/week/month/year
        const stats = await OrderService.getOrderStats(String(period));
        res.json(stats);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
export default router;