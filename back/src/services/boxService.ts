import BoxModel from '../models/boxModel';
import userModel from '../models/userModel';
import { Box, BoxInput } from '../types/box';
import { BoxItem } from '../types/box'
import pool from '../config/database';  
// import api from './api';

class BoxService {
    // 创建盲盒
    async createBox(boxData: Omit<BoxInput, 'boxId'>): Promise<Box> {
        // 验证盲盒数量不超过物品数量总和
        const totalItems = boxData.items.reduce((sum, item) => sum + item.quantity, 0);
        if (boxData.boxNum > totalItems) {
            throw new Error('盲盒的数量不能大于包含物品中所有物品数量总和');
        }
        return BoxModel.createBox(boxData);
    }

    // 获取所有盲盒
    async getAllBoxes(): Promise<Box[]> {
        const boxes = await BoxModel.getAllBoxes();
        return boxes;
        // return BoxModel.getAllBoxes();
    }

    // 根据ID获取盲盒
    async getBoxById(boxId: number): Promise<Box> {
        return BoxModel.getBoxById(boxId);
    }

    // 删除盲盒
    async deleteBox(boxId: number): Promise<void> {
        await BoxModel.deleteBox(boxId);
    }
    async purchaseBox(boxId: number, userId: number): Promise<{ item: BoxItem; remaining: number }> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 获取盲盒信息
            const box = await this.getBoxById(boxId);
            
            // 获取用户余额
            const user = await userModel.getUserById(userId);
            
            // 验证余额是否足够
            if (user.money < box.price) {
                throw new Error('余额不足');
            }

            // 获取可用物品
            const availableItems = await BoxModel.getAvailableItems(boxId);
            if (availableItems.length === 0) {
                throw new Error('该盲盒已无可用物品');
            }

            // 随机选择一件物品
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const selectedItem = availableItems[randomIndex];

            // 更新物品数量
            await BoxModel.decrementItemQuantity(boxId, selectedItem.name);

            // 更新盲盒数量
            const remaining = await BoxModel.decrementBoxQuantity(boxId);

            // 扣除用户余额
            await userModel.updateMoney(userId, -box.price);

            // 检查盲盒是否已空
            if (remaining === 0) {
                await this.deleteBox(boxId);
            }

            await connection.commit();

            return {
                item: selectedItem,
                remaining
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    
}

export default new BoxService();