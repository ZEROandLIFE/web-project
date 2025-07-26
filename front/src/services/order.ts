import api from './api';
export interface Order {
    orderId: number;
    boxId: number;
    sellerId: number;
    buyerId: number;
    boxName: string;
    itemName: string;
    price: number;
    createdAt: string;
}
export interface OrderStats {
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
export interface OrderResponse {
    orders: Order[];
    total: number;
}
export const getMyOrders = async (): Promise<OrderResponse> => {
    const response = await api.get('/orders/my');
    return response.data;
};

export const getOrdersAsSeller = async (): Promise<OrderResponse> => {
    const response = await api.get('/orders/seller');
    return response.data;
};

export const getOrdersAsBuyer = async (): Promise<OrderResponse> => {
    const response = await api.get('/orders/buyer');
    return response.data;
};
export const getAdminAllOrders = async (params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    sellerId?: number;
    buyerId?: number;
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
}): Promise<{
    orders: Order[];
    total: number;
    page: number;
    pageSize: number;
}> => {
    try {
        // 转换日期格式并过滤undefined值
        const filteredParams = Object.fromEntries(
            Object.entries({
                ...params,
                startDate: params.startDate ? new Date(params.startDate).toISOString() : undefined,
                endDate: params.endDate ? new Date(params.endDate).toISOString() : undefined
            }).filter(([_, v]) => v !== undefined)
        );

        const response = await api.get('/orders/admin/all', {
            params: filteredParams
        });
        return response.data;
    } catch (error) {
        console.error('获取订单失败:', error);
        throw error;
    }
};

// 获取订单统计
export const getOrderStats = async (period: string): Promise<OrderStats> => {
    try {
        const response = await api.get('/orders/admin/stats', {
            params: { period }
        });
        return response.data;
    } catch (error) {
        console.error('获取统计失败:', error);
        throw error;
    }
};