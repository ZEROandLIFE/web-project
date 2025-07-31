import { Request, Response } from 'express';
import OrderService from '../services/orderService';

/**
 * 获取当前用户的订单列表
 * @param req 请求对象，需包含认证用户信息
 * @param res 响应对象，返回订单列表和总数
 * @response 200 返回订单数据 { orders: Array, total: number }
 * @response 400 请求处理失败
 */
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        // 从认证信息中获取用户ID
        const userId = (req as any).user.id;
        const orders = await OrderService.getUserOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * 获取卖家订单列表（作为卖家查看）
 * @param req 请求对象，需包含认证用户信息
 * @param res 响应对象，返回订单列表和总数
 * @response 200 返回订单数据 { orders: Array, total: number }
 * @response 400 请求处理失败
 */
export const getSellerOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const orders = await OrderService.getSellerOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * 获取买家订单列表（作为买家查看）
 * @param req 请求对象，需包含认证用户信息
 * @param res 响应对象，返回订单列表和总数
 * @response 200 返回订单数据 { orders: Array, total: number }
 * @response 400 请求处理失败
 */
export const getBuyerOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const orders = await OrderService.getBuyerOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * 管理员获取所有订单（支持分页、排序、筛选）
 * @param req 请求对象，需包含管理员认证信息
 * @param res 响应对象，返回分页订单数据
 * @queryParam page 当前页码，默认1
 * @queryParam pageSize 每页数量，默认20
 * @queryParam sortBy 排序字段，默认createdAt
 * @queryParam sortOrder 排序方式，asc/desc，默认desc
 * @queryParam search 搜索关键词
 * @queryParam sellerId 卖家ID筛选
 * @queryParam buyerId 买家ID筛选
 * @queryParam minPrice 最低价格筛选
 * @queryParam maxPrice 最高价格筛选
 * @queryParam startDate 开始日期筛选
 * @queryParam endDate 结束日期筛选
 * @response 200 返回分页订单数据 { orders: Array, total: number, page: number, totalPages: number }
 * @response 403 无管理员权限
 * @response 400 请求处理失败
 */
export const getAdminAllOrders = async (req: Request, res: Response) => {
    try {
        // 权限校验
        if ((req as any).user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }

        // 解析查询参数
        const { 
            page = 1, 
            pageSize = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search = '',
            sellerId,
            buyerId,
            minPrice,
            maxPrice,
            startDate,
            endDate
        } = req.query;
        
        // 调用服务层方法
        const result = await OrderService.getAdminAllOrders({
            page: Number(page),
            pageSize: Number(pageSize),
            sortBy: String(sortBy),
            sortOrder: String(sortOrder) as 'asc' | 'desc',
            search: String(search),
            sellerId: sellerId ? Number(sellerId) : undefined,
            buyerId: buyerId ? Number(buyerId) : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            startDate: startDate ? new Date(String(startDate)) : undefined,
            endDate: endDate ? new Date(String(endDate)) : undefined
        });
        
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * 获取订单统计信息
 * @param req 请求对象，需包含管理员认证信息
 * @param res 响应对象，返回统计数据
 * @queryParam period 统计周期，day/week/month，默认day
 * @response 200 返回统计数据 { [key: string]: number }
 * @response 403 无管理员权限
 * @response 400 请求处理失败
 */
export const getOrderStats = async (req: Request, res: Response) => {
    try {
        // 权限校验
        if ((req as any).user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }

        // 获取统计周期参数
        const { period = 'day' } = req.query;
        const stats = await OrderService.getOrderStats(String(period));
        res.json(stats);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};