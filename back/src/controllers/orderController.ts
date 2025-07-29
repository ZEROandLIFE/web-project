// controllers/orderController.ts
import { Request, Response } from 'express';
import OrderService from '../services/orderService';

export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const orders = await OrderService.getUserOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getSellerOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const orders = await OrderService.getSellerOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getBuyerOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const orders = await OrderService.getBuyerOrders(userId);
        res.json({ orders, total: orders.length });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getAdminAllOrders = async (req: Request, res: Response) => {
    try {
        if ((req as any).user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }

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

export const getOrderStats = async (req: Request, res: Response) => {
    try {
        if ((req as any).user.role !== 'admin') {
            return res.status(403).json({ error: '无权访问' });
        }

        const { period = 'day' } = req.query;
        const stats = await OrderService.getOrderStats(String(period));
        res.json(stats);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};