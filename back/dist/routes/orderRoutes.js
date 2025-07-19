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
exports.default = router;
