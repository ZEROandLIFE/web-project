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

export { Order, OrderInput };