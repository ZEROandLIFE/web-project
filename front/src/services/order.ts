import api from './api';

/**
 * 订单类型
 * @property {number} orderId - 订单ID
 * @property {number} boxId - 盲盒ID
 * @property {number} sellerId - 卖家用户ID
 * @property {number} buyerId - 买家用户ID
 * @property {string} boxName - 盲盒名称
 * @property {string} itemName - 获得的物品名称
 * @property {number} price - 订单价格
 * @property {string} createdAt - 订单创建时间(ISO格式字符串)
 */
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

/**
 * 订单统计信息
 * @property {number} totalOrders - 总订单数
 * @property {number} totalRevenue - 总收入
 * @property {number} avgOrderValue - 平均订单价值
 * @property {Array<{date: string, count: number, revenue: number}>} orderTrends - 订单趋势数据
 * @property {Array<{userId: number, username: string, orderCount: number, totalRevenue: number}>} topSellers - 顶级卖家列表
 * @property {Array<{userId: number, username: string, orderCount: number, totalSpent: number}>} topBuyers - 顶级买家列表
 */
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

/**
 * 订单响应结构
 * @property {Order[]} orders - 订单列表
 * @property {number} total - 订单总数
 */
export interface OrderResponse {
    orders: Order[];
    total: number;
}

/**
 * 获取当前用户的所有订单
 * @returns {Promise<OrderResponse>} 包含订单列表和总数的响应对象
 */
export const getMyOrders = async (): Promise<OrderResponse> => {
    const response = await api.get('/orders/my');
    return response.data;
};

/**
 * 获取作为卖家的所有订单
 * @returns {Promise<OrderResponse>} 包含订单列表和总数的响应对象
 */
export const getOrdersAsSeller = async (): Promise<OrderResponse> => {
    const response = await api.get('/orders/seller');
    return response.data;
};

/**
 * 获取作为买家的所有订单
 * @returns {Promise<OrderResponse>} 包含订单列表和总数的响应对象
 */
export const getOrdersAsBuyer = async (): Promise<OrderResponse> => {
    const response = await api.get('/orders/buyer');
    return response.data;
};

/**
 * 管理员获取所有订单（支持分页、排序、筛选）
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 当前页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @param {string} [params.sortBy='createdAt'] - 排序字段
 * @param {'asc' | 'desc'} [params.sortOrder='desc'] - 排序顺序
 * @param {string} [params.search] - 搜索关键词
 * @param {number} [params.sellerId] - 卖家ID筛选
 * @param {number} [params.buyerId] - 买家ID筛选
 * @param {number} [params.minPrice] - 最低价格筛选
 * @param {number} [params.maxPrice] - 最高价格筛选
 * @param {string} [params.startDate] - 开始日期(YYYY-MM-DD)
 * @param {string} [params.endDate] - 结束日期(YYYY-MM-DD)
 * @returns {Promise<{orders: Order[], total: number, page: number, pageSize: number}>} 分页订单数据
 * @throws {Error} 当请求失败时抛出错误
 */
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

/**
 * 获取订单统计信息
 * @param {string} period - 统计周期('day'|'week'|'month'|'year')
 * @returns {Promise<OrderStats>} 订单统计信息对象
 * @throws {Error} 当请求失败时抛出错误
 */
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