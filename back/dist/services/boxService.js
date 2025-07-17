"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boxModel_1 = __importDefault(require("../models/boxModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const database_1 = __importDefault(require("../config/database"));
// import api from './api';
class BoxService {
    // 创建盲盒
    async createBox(boxData) {
        // 验证盲盒数量不超过物品数量总和
        const totalItems = boxData.items.reduce((sum, item) => sum + item.quantity, 0);
        if (boxData.boxNum > totalItems) {
            throw new Error('盲盒的数量不能大于包含物品中所有物品数量总和');
        }
        return boxModel_1.default.createBox(boxData);
    }
    // 获取所有盲盒
    async getAllBoxes() {
        const boxes = await boxModel_1.default.getAllBoxes();
        return boxes;
        // return BoxModel.getAllBoxes();
    }
    // 根据ID获取盲盒
    async getBoxById(boxId) {
        return boxModel_1.default.getBoxById(boxId);
    }
    // 上传盲盒图片
    async uploadBoxImage(file) {
        // 这里可以添加图片处理逻辑，如压缩、格式转换等
        // 实际项目中可能会上传到云存储服务如AWS S3、阿里云OSS等
        return { url: `/uploads/${file.filename}` };
    }
    // 删除盲盒
    async deleteBox(boxId) {
        await boxModel_1.default.deleteBox(boxId);
    }
    async purchaseBox(boxId, userId) {
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            // 获取盲盒信息
            const box = await this.getBoxById(boxId);
            // 获取用户余额
            const user = await userModel_1.default.getUserById(userId);
            // 验证余额是否足够
            if (user.money < box.price) {
                throw new Error('余额不足');
            }
            // 获取可用物品
            const availableItems = await boxModel_1.default.getAvailableItems(boxId);
            if (availableItems.length === 0) {
                throw new Error('该盲盒已无可用物品');
            }
            // 随机选择一件物品
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const selectedItem = availableItems[randomIndex];
            // 更新物品数量
            await boxModel_1.default.decrementItemQuantity(boxId, selectedItem.name);
            // 更新盲盒数量
            const remaining = await boxModel_1.default.decrementBoxQuantity(boxId);
            // 扣除用户余额
            await userModel_1.default.updateMoney(userId, -box.price);
            // 检查盲盒是否已空
            if (remaining === 0) {
                await this.deleteBox(boxId);
            }
            await connection.commit();
            return {
                item: selectedItem,
                remaining
            };
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
}
exports.default = new BoxService();
