// models/orderModel.ts
import pool from '../config/database';
import { Order, OrderInput, AdminOrderQuery, OrderStats } from '../types/order';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

/**
 * 订单数据模型类，处理与订单相关的数据库操作
 */
class OrderModel {
    /**
     * 创建新订单
     * @param orderData - 订单数据对象
     * @returns 创建的订单详情
     */
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

    /**
     * 根据订单ID获取订单详情
     * @param orderId - 订单ID
     * @returns 订单详情
     * @throws 当订单不存在时抛出错误
     */
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

    /**
     * 获取用户的所有订单（作为卖家或买家）
     * @param userId - 用户ID
     * @returns 订单列表，按创建时间降序排列
     */
    async getOrdersByUserId(userId: number): Promise<Order[]> {
        const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
            `SELECT * FROM orders 
            WHERE sellerId = ? OR buyerId = ?
            ORDER BY createdAt DESC`,
            [userId, userId]
        );
        
        return rows;
    }

    /**
     * 获取用户作为卖家的所有订单
     * @param sellerId - 卖家用户ID
     * @returns 订单列表，按创建时间降序排列
     */
    async getSellerOrders(sellerId: number): Promise<Order[]> {
        const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
            `SELECT * FROM orders 
            WHERE sellerId = ?
            ORDER BY createdAt DESC`,
            [sellerId]
        );
        
        return rows;
    }

    /**
     * 获取用户作为买家的所有订单
     * @param buyerId - 买家用户ID
     * @returns 订单列表，按创建时间降序排列
     */
    async getBuyerOrders(buyerId: number): Promise<Order[]> {
        const [rows] = await pool.execute<(Order & RowDataPacket)[]>(
            `SELECT * FROM orders 
            WHERE buyerId = ?
            ORDER BY createdAt DESC`,
            [buyerId]
        );
        
        return rows;
    }

    /**
     * 管理员获取所有订单（支持分页、筛选、排序）
     * @param query - 查询参数对象
     * @returns 包含订单列表、总数、分页信息的对象
     */
    async getAdminAllOrders(query: AdminOrderQuery): Promise<{
        orders: Order[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const connection = await pool.getConnection();
        try {
            // 排序字段映射（防止SQL注入）
            const sortFieldMap: Record<string, string> = {
                'date': 'createdAt',
                'price': 'price',
                'orderId': 'orderId'
            };
            const safeSortBy = sortFieldMap[query.sortBy] || 'createdAt';

            const page = Number(query.page) || 1;
            const pageSize = Number(query.pageSize) || 20;
            const offset = (page - 1) * pageSize; 

            // 构建基础查询语句
            let baseQuery = `FROM orders WHERE 1=1`;
            const params: any[] = [];

            // 添加筛选条件
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

            // 获取总数
            const [totalRes] = await connection.execute<RowDataPacket[]>(
                `SELECT COUNT(*) as total ${baseQuery}`,
                params
            );
            const total = totalRes[0].total;

            // 获取分页数据
            const [rows] = await connection.execute<(Order & RowDataPacket)[]>(
                `SELECT * ${baseQuery} ORDER BY ${safeSortBy} ${query.sortOrder} LIMIT ? OFFSET ?`,
                [...params, pageSize, offset]
            );
            
            return {
                orders: rows,
                total,
                page,
                pageSize
            };
        } catch (error) {
            console.error('数据库错误:', error);
            throw new Error(`查询失败`);
        } finally {
            connection.release();
        }
    }

    /**
     * 获取订单统计信息
     * @param period - 统计周期（day/week/month）
     * @returns 包含各种统计数据的对象
     */
    async getOrderStats(period: string): Promise<OrderStats> {
        // 1. 获取基础统计数据
        const [baseStats] = await pool.execute<RowDataPacket[]>(`
            SELECT 
                COUNT(*) as totalOrders,
                SUM(price) as totalRevenue,
                AVG(price) as avgOrderValue
            FROM orders
        `);

        // 2. 根据周期获取趋势数据
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

        // 3. 获取顶级卖家数据
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

        // 4. 获取顶级买家数据
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

        // 返回整合后的统计数据
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

export default new OrderModel();