"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/orderService.ts
const orderModel_1 = __importDefault(require("../models/orderModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const database_1 = __importDefault(require("../config/database"));
class OrderService {
    // 创建订单并给卖家加钱
    async createOrderAndPaySeller(orderData) {
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            // 创建订单
            const order = await orderModel_1.default.createOrder(orderData);
            // 给卖家加钱
            await userModel_1.default.updateMoney(orderData.sellerId, orderData.price);
            await connection.commit();
            return order;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    // 获取用户所有订单
    async getUserOrders(userId) {
        return orderModel_1.default.getOrdersByUserId(userId);
    }
    // 获取用户作为卖家的订单
    async getSellerOrders(sellerId) {
        return orderModel_1.default.getSellerOrders(sellerId);
    }
    // 获取用户作为买家的订单
    async getBuyerOrders(buyerId) {
        return orderModel_1.default.getBuyerOrders(buyerId);
    }
}
exports.default = new OrderService();
