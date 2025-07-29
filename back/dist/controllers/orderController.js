"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStats = exports.getAdminAllOrders = exports.getBuyerOrders = exports.getSellerOrders = exports.getUserOrders = void 0;
const orderService_1 = __importDefault(require("../services/orderService"));
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService_1.default.getUserOrders(userId);
        res.json({ orders, total: orders.length });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getUserOrders = getUserOrders;
const getSellerOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService_1.default.getSellerOrders(userId);
        res.json({ orders, total: orders.length });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getSellerOrders = getSellerOrders;
const getBuyerOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService_1.default.getBuyerOrders(userId);
        res.json({ orders, total: orders.length });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getBuyerOrders = getBuyerOrders;
const getAdminAllOrders = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }
        const { page = 1, pageSize = 20, sortBy = 'createdAt', sortOrder = 'desc', search = '', sellerId, buyerId, minPrice, maxPrice, startDate, endDate } = req.query;
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
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAdminAllOrders = getAdminAllOrders;
const getOrderStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }
        const { period = 'day' } = req.query;
        const stats = await orderService_1.default.getOrderStats(String(period));
        res.json(stats);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getOrderStats = getOrderStats;
