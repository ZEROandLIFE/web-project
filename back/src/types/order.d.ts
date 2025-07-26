// types/order.d.ts
import { RowDataPacket } from 'mysql2';

interface Order extends RowDataPacket {
    orderId: number;
    boxId: number;
    sellerId: number;
    buyerId: number;
    boxName: string;
    itemName: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

interface OrderInput {
    boxId: number;
    sellerId: number;
    buyerId: number;
    boxName: string;
    itemName: string;
    price: number;
}
interface AdminOrderQuery {
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    sellerId?: number;
    buyerId?: number;
    minPrice?: number;
    maxPrice?: number;
    startDate?: Date;
    endDate?: Date;
}

interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    orderTrends: Array<{
        date: string;
        count: number;
        revenue: number;
    }>;
    topSellers: Array<{
        userId: number;
        username: string;
        orderCount: number;
        totalRevenue: number;
    }>;
    topBuyers: Array<{
        userId: number;
        username: string;
        orderCount: number;
        totalSpent: number;
    }>;
}
export { Order, OrderInput,AdminOrderQuery,OrderStats };