import BoxModel from '../models/boxModel';
import userModel from '../models/userModel';
import { Box, BoxInput } from '../types/box';
import { BoxItem } from '../types/box'
import pool from '../config/database';  
import OrderService from "./orderService"

/**
 * 盲盒业务逻辑服务
 * @class BoxService
 * @description 处理盲盒相关的核心业务逻辑
 */
class BoxService {
    /**
     * 创建新的盲盒
     * @param {Omit<BoxInput, 'boxId'>} boxData - 盲盒数据（不包含boxId）
     * @returns {Promise<Box>} 创建成功的盲盒对象
     * @throws {Error} 当盲盒数量大于物品总数时抛出错误
     * @memberof BoxService
     */
    async createBox(boxData: Omit<BoxInput, 'boxId'>): Promise<Box> {
        // 验证盲盒数量不超过物品数量总和
        const totalItems = boxData.items.reduce((sum, item) => sum + item.quantity, 0);
        if (boxData.boxNum > totalItems) {
            throw new Error('盲盒的数量不能大于包含物品中所有物品数量总和');
        }
        return BoxModel.createBox(boxData);
    }

    /**
     * 获取所有盲盒列表
     * @returns {Promise<Box[]>} 盲盒数组
     * @memberof BoxService
     */
    async getAllBoxes(): Promise<Box[]> {
        return BoxModel.getAllBoxes();
    }

    /**
     * 根据ID获取单个盲盒详情
     * @param {number} boxId - 盲盒ID
     * @returns {Promise<Box>} 盲盒对象
     * @memberof BoxService
     */
    async getBoxById(boxId: number): Promise<Box> {
        return BoxModel.getBoxById(boxId);
    }

    /**
     * 删除指定ID的盲盒
     * @param {number} boxId - 要删除的盲盒ID
     * @returns {Promise<void>} 无返回值
     * @memberof BoxService
     */
    async deleteBox(boxId: number): Promise<void> {
        await BoxModel.deleteBox(boxId);
    }

    /**
     * 购买盲盒
     * @param {number} boxId - 要购买的盲盒ID
     * @param {number} userId - 购买用户ID
     * @returns {Promise<{ item: BoxItem; remaining: number }>} 包含抽中的物品和剩余数量
     * @throws {Error} 当余额不足或盲盒已空时抛出错误
     * @memberof BoxService
     */
    async purchaseBox(boxId: number, userId: number): Promise<{ item: BoxItem; remaining: number }> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. 获取盲盒信息
            const box = await this.getBoxById(boxId);
            
            // 2. 验证用户余额
            const user = await userModel.getUserById(userId);
            if (Number(user.money) < Number(box.price)) {
                throw new Error('余额不足');
            }

            // 3. 获取可用物品列表
            const availableItems = await BoxModel.getAvailableItems(boxId);
            if (availableItems.length === 0) {
                throw new Error('该盲盒已无可用物品');
            }

            // 4. 随机选择一件物品
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const selectedItem = availableItems[randomIndex];

            // 5. 更新物品数量
            await BoxModel.decrementItemQuantity(boxId, selectedItem.name);

            // 6. 更新盲盒剩余数量
            const remaining = await BoxModel.decrementBoxQuantity(boxId);

            // 7. 扣除用户余额并创建订单
            await userModel.updateMoney(userId, -box.price);
            await OrderService.createOrderAndPaySeller({
                boxId,
                sellerId: box.userId,
                buyerId: userId,
                boxName: box.boxName,
                itemName: selectedItem.name,
                price: box.price
            });

            // 8. 检查盲盒是否已空
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