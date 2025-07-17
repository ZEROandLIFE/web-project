import { RowDataPacket } from 'mysql2';

interface BoxItem extends RowDataPacket {
    name: string;
    quantity: number;
}

interface Box extends RowDataPacket {
    boxId?: number;
    boxName: string;
    boxDescription: string;
    boxNum: number;
    boxAvatar?: string;
    price: number;
    userId: number;
    items: BoxItem[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface BoxInput {
    boxName: string;
    boxDescription: string;
    boxNum: number;
    boxAvatar?: string;
    price: number;
    userId: number;
    items: BoxItem[];
}

export { Box, BoxItem, BoxInput };