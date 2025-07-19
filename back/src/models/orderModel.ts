// models/orderModel.ts
import pool from '../config/database';
import { Order, OrderInput } from '../types/order';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class OrderModel {
    // 创建订单
    async createOrder(orderData: OrderInput): Promise<Order> {
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO orders 
            (boxId, sellerId, buyerId, boxName, itemName, price) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                orderData.boxId,
                orderData.sellerId,
                orderData.buyerId,
                orderData.boxName,
                orderData.itemName,
                orderData.price
            ]
        );
        
        return this.getOrderById(result.insertId);
    }

    // 根据ID获取订单
    async getOrderById(orderId: number): Promise<Order> {
        const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
            `SELECT * FROM orders WHERE orderId = ?`,
            [orderId]
        );
        
        if (rows.length === 0) {
            throw new Error('Order not found');
        }
        
        return rows[0];
    }

    // 获取用户所有订单（作为卖家或买家）
    async getOrdersByUserId(userId: number): Promise<Order[]> {
        const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
            `SELECT * FROM orders 
            WHERE sellerId = ? OR buyerId = ?
            ORDER BY createdAt DESC`,
            [userId, userId]
        );
        
        return rows;
    }

    // 获取卖家订单
    async getSellerOrders(sellerId: number): Promise<Order[]> {
        const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
            `SELECT * FROM orders 
            WHERE sellerId = ?
            ORDER BY createdAt DESC`,
            [sellerId]
        );
        
        return rows;
    }

    // 获取买家订单
    async getBuyerOrders(buyerId: number): Promise<Order[]> {
        const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
            `SELECT * FROM orders 
            WHERE buyerId = ?
            ORDER BY createdAt DESC`,
            [buyerId]
        );
        
        return rows;
    }
}

export default new OrderModel();