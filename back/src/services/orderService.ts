// services/orderService.ts
import OrderModel from '../models/orderModel';
import userModel from '../models/userModel';
import { Order, OrderInput, AdminOrderQuery, OrderStats } from '../types/order';
import { RowDataPacket } from 'mysql2';
import pool from '../config/database'; 

class OrderService {
    // 创建订单并给卖家加钱
    async createOrderAndPaySeller(orderData: OrderInput): Promise<Order> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 创建订单
            const order = await OrderModel.createOrder(orderData);

            // 给卖家加钱
            await userModel.updateMoney(orderData.sellerId, orderData.price);

            await connection.commit();
            return order;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 获取用户所有订单
    async getUserOrders(userId: number): Promise<Order[]> {
        return OrderModel.getOrdersByUserId(userId);
    }

    // 获取用户作为卖家的订单
    async getSellerOrders(sellerId: number): Promise<Order[]> {
        return OrderModel.getSellerOrders(sellerId);
    }

    // 获取用户作为买家的订单
    async getBuyerOrders(buyerId: number): Promise<Order[]> {
        return OrderModel.getBuyerOrders(buyerId);
    }

    async getAdminAllOrders(query: AdminOrderQuery): Promise<{
        orders: Order[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        return OrderModel.getAdminAllOrders(query);
    }

    // 订单统计方法
    async getOrderStats(period: string): Promise<OrderStats> {
        return OrderModel.getOrderStats(period);
    }
}

export default new OrderService();