"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/orderModel.ts
const database_1 = __importDefault(require("../config/database"));
class OrderModel {
    // 创建订单
    async createOrder(orderData) {
        const [result] = await database_1.default.execute(`INSERT INTO orders 
            (boxId, sellerId, buyerId, boxName, itemName, price) 
            VALUES (?, ?, ?, ?, ?, ?)`, [
            orderData.boxId,
            orderData.sellerId,
            orderData.buyerId,
            orderData.boxName,
            orderData.itemName,
            orderData.price
        ]);
        return this.getOrderById(result.insertId);
    }
    // 根据ID获取订单
    async getOrderById(orderId) {
        const [rows] = await database_1.default.execute(`SELECT * FROM orders WHERE orderId = ?`, [orderId]);
        if (rows.length === 0) {
            throw new Error('Order not found');
        }
        return rows[0];
    }
    // 获取用户所有订单（作为卖家或买家）
    async getOrdersByUserId(userId) {
        const [rows] = await database_1.default.execute(`SELECT * FROM orders 
            WHERE sellerId = ? OR buyerId = ?
            ORDER BY createdAt DESC`, [userId, userId]);
        return rows;
    }
    // 获取卖家订单
    async getSellerOrders(sellerId) {
        const [rows] = await database_1.default.execute(`SELECT * FROM orders 
            WHERE sellerId = ?
            ORDER BY createdAt DESC`, [sellerId]);
        return rows;
    }
    // 获取买家订单
    async getBuyerOrders(buyerId) {
        const [rows] = await database_1.default.execute(`SELECT * FROM orders 
            WHERE buyerId = ?
            ORDER BY createdAt DESC`, [buyerId]);
        return rows;
    }
}
exports.default = new OrderModel();
