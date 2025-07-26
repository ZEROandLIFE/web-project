"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/orderRoutes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const orderService_1 = __importDefault(require("../services/orderService"));
const router = express_1.default.Router();
// 获取用户所有订单
router.get('/my', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService_1.default.getUserOrders(userId);
        res.json({ orders, total: orders.length });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 获取用户作为卖家的订单
router.get('/seller', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService_1.default.getSellerOrders(userId);
        res.json({ orders, total: orders.length });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 获取用户作为买家的订单
router.get('/buyer', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService_1.default.getBuyerOrders(userId);
        res.json({ orders, total: orders.length });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 管理员获取所有订单
router.get('/admin/all', auth_1.authenticate, async (req, res) => {
    try {
        // 检查管理员权限
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }
        const { page = 1, pageSize = 20, sortBy = 'createdAt', sortOrder = 'desc', search = '', sellerId, buyerId, minPrice, maxPrice, startDate, endDate } = req.query;
        console.log(1);
        const result = await orderService_1.default.getAdminAllOrders({
            page: Number(page),
            pageSize: Number(pageSize),
            sortBy: String(sortBy),
            sortOrder: String(sortOrder),
            search: String(search),
            sellerId: sellerId ? Number(sellerId) : undefined,
            buyerId: buyerId ? Number(buyerId) : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            startDate: startDate ? new Date(String(startDate)) : undefined,
            endDate: endDate ? new Date(String(endDate)) : undefined
        });
        console.log(2);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// 订单统计接口
router.get('/admin/stats', auth_1.authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }
        const { period = 'day' } = req.query; // day/week/month/year
        const stats = await orderService_1.default.getOrderStats(String(period));
        res.json(stats);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
