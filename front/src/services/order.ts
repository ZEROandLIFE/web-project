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