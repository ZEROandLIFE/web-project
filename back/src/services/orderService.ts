// services/orderService.ts
import OrderModel from '../models/orderModel';
import userModel from '../models/userModel';
import { Order, OrderInput, AdminOrderQuery, OrderStats } from '../types/order';
import { RowDataPacket } from 'mysql2';
import pool from '../config/database'; 

/**
 * 订单服务类
 * @class OrderService
 * @description 处理订单相关业务逻辑，包括订单创建、查询和统计
 */
class OrderService {
    /**
     * 创建订单并完成卖家收款
     * @async
     * @param {OrderInput} orderData - 订单创建数据
     * @returns {Promise<Order>} 创建成功的订单对象
     * @throws {Error} 事务处理失败时抛出异常
     * @description 该方法在一个事务中完成订单创建和卖家资金增加操作
     */
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

    /**
     * 获取用户所有相关订单（包括买家和卖家订单）
     * @async
     * @param {number} userId - 用户ID
     * @returns {Promise<Order[]>} 订单列表
     */
    async getUserOrders(userId: number): Promise<Order[]> {
        return OrderModel.getOrdersByUserId(userId);
    }

    /**
     * 获取用户作为卖家的订单
     * @async
     * @param {number} sellerId - 卖家用户ID
     * @returns {Promise<Order[]>} 卖家订单列表
     */
    async getSellerOrders(sellerId: number): Promise<Order[]> {
        return OrderModel.getSellerOrders(sellerId);
    }

    /**
     * 获取用户作为买家的订单
     * @async
     * @param {number} buyerId - 买家用户ID
     * @returns {Promise<Order[]>} 买家订单列表
     */
    async getBuyerOrders(buyerId: number): Promise<Order[]> {
        return OrderModel.getBuyerOrders(buyerId);
    }

    /**
     * 管理员获取所有订单（支持分页和筛选）
     * @async
     * @param {AdminOrderQuery} query - 查询参数（分页、筛选条件等）
     * @returns {Promise<{orders: Order[]; total: number; page: number; pageSize: number}>} 
     * 包含订单列表和分页信息的对象
     */
    async getAdminAllOrders(query: AdminOrderQuery): Promise<{
        orders: Order[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        return OrderModel.getAdminAllOrders(query);
    }

    /**
     * 获取订单统计信息
     * @async
     * @param {string} period - 统计周期（如：'day', 'week', 'month'）
     * @returns {Promise<OrderStats>} 订单统计数据
     */
    async getOrderStats(period: string): Promise<OrderStats> {
        return OrderModel.getOrderStats(period);
    }
}

export default new OrderService();