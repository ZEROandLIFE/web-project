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
    const connection = await pool.getConnection();
        try {
        
        // 1. 定义排序字段映射
        const sortFieldMap: Record<string, string> = {
            'date': 'createdAt',
            'price': 'price',
            'orderId': 'orderId'
        };
        const safeSortBy = sortFieldMap[query.sortBy] || 'createdAt';

        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 20;
        const offset = (page - 1) * pageSize; 

        // 2. 构建查询
        let baseQuery = `FROM orders WHERE 1=1`;
        const params: any[] = [];

        // 4. 添加筛选条件（确保所有参数都有值）
        if (query.search) {
            baseQuery += ` AND (boxName LIKE ? OR itemName LIKE ?)`;
            params.push(`%${query.search}%`, `%${query.search}%`);
        }
        if (query.sellerId !== undefined) {
            baseQuery += ` AND sellerId = ?`;
            params.push(query.sellerId);
        }
        if (query.buyerId !== undefined) {
            baseQuery += ` AND buyerId = ?`;
            params.push(query.buyerId);
        }
        if (query.minPrice !== undefined) {
            baseQuery += ` AND price >= ?`;
            params.push(query.minPrice);
        }
        if (query.maxPrice !== undefined) {
            baseQuery += ` AND price <= ?`;
            params.push(query.maxPrice);
        }
        if (query.startDate) {
            baseQuery += ` AND createdAt >= ?`;
            params.push(new Date(query.startDate));
        }
        if (query.endDate) {
            baseQuery += ` AND createdAt <= ?`;
            params.push(new Date(query.endDate));
        }

        // 5. 获取总数
        const [totalRes] = await connection.execute<RowDataPacket[]>(
            `SELECT COUNT(*) as total ${baseQuery}`,
            params
        );
        const total = totalRes[0].total;

        // 6. 获取订单数据（关键修改点）
        const mainQuery = `
            SELECT * 
            ${baseQuery} 
            ORDER BY ${safeSortBy} ${query.sortOrder} 
            LIMIT ${pageSize} OFFSET ${offset}  
        `;
        const mainParams = [...params, pageSize, offset];
        
    

        const [rows] = await connection.execute<(Order & RowDataPacket)[]>(mainQuery, mainParams);
        
        return {
            orders: rows,
            total,
            page: query.page,
            pageSize: query.pageSize
        };
    } catch (error) {
        console.error('数据库错误:', error);
        throw new Error(`查询失败`);
    } finally {
        connection.release();
    }
}

    // 订单统计方法
    async getOrderStats(period: string): Promise<OrderStats> {
        // 1. 基础统计
                
        const [baseStats] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                COUNT(*) as totalOrders,
                SUM(price) as totalRevenue,
                AVG(price) as avgOrderValue
            FROM orders
        `);

        // 2. 趋势统计
        let dateFormat: string;
        switch (period) {
            case 'day': dateFormat = '%Y-%m-%d'; break;
            case 'week': dateFormat = '%Y-%u'; break;
            case 'month': dateFormat = '%Y-%m'; break;
            default: dateFormat = '%Y'; break;
        }

        const [trends] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                DATE_FORMAT(createdAt, ?) as date,
                COUNT(*) as count,
                SUM(price) as revenue
            FROM orders
            GROUP BY date
            ORDER BY date
        `, [dateFormat]);

        // 3. 顶级卖家
        const [topSellers] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                sellerId as userId,
                u.username,
                COUNT(*) as orderCount,
                SUM(o.price) as totalRevenue
            FROM orders o
            JOIN users u ON o.sellerId = u.id
            GROUP BY sellerId
            ORDER BY totalRevenue DESC
            LIMIT 5
        `);

        // 4. 顶级买家
        const [topBuyers] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                buyerId as userId,
                u.username,
                COUNT(*) as orderCount,
                SUM(o.price) as totalSpent
            FROM orders o
            JOIN users u ON o.buyerId = u.id
            GROUP BY buyerId
            ORDER BY totalSpent DESC
            LIMIT 5
        `);

        return {
            totalOrders: baseStats[0].totalOrders,
            totalRevenue: baseStats[0].totalRevenue || 0,
            avgOrderValue: baseStats[0].avgOrderValue || 0,
            orderTrends: trends.map(t => ({
                date: t.date,
                count: t.count,
                revenue: t.revenue
            })),
            topSellers: topSellers.map(s => ({
                userId: s.userId,
                username: s.username,
                orderCount: s.orderCount,
                totalRevenue: s.totalRevenue
            })),
            topBuyers: topBuyers.map(b => ({
                userId: b.userId,
                username: b.username,
                orderCount: b.orderCount,
                totalSpent: b.totalSpent
            }))
        };
    }
}

export default new OrderService();