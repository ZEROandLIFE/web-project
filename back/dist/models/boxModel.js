"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
/**
 * 盲盒数据模型类
 * 提供盲盒的CRUD操作及库存管理功能
 */
class BoxModel {
    /**
     * 创建新盲盒
     * @param boxData 盲盒数据（包含基本信息和物品列表）
     * @returns 创建成功的盲盒完整信息
     * @throws 数据库操作错误
     */
    async createBox(boxData) {
        const { boxName, boxDescription, boxNum, boxAvatar, price, userId, items } = boxData;
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            // 插入盲盒基本信息
            const [boxResult] = await connection.execute(`INSERT INTO boxes 
                (boxName, boxDescription, boxNum, boxAvatar, price, userId) 
                VALUES (?, ?, ?, ?, ?, ?)`, [boxName, boxDescription, boxNum, boxAvatar || null, price, userId]);
            const boxId = boxResult.insertId;
            // 批量插入盲盒物品
            for (const item of items) {
                await connection.execute(`INSERT INTO box_items 
                    (boxId, itemName, quantity) 
                    VALUES (?, ?, ?)`, [boxId, item.name, item.quantity]);
            }
            await connection.commit();
            return this.getBoxById(boxId);
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    /**
     * 获取所有盲盒列表（按创建时间降序）
     * @returns 盲盒数组（每个盲盒包含物品信息）
     */
    async getAllBoxes() {
        // 获取盲盒基本信息
        const [rows] = await database_1.default.execute(`SELECT * FROM boxes ORDER BY created_at DESC`);
        // 并行获取每个盲盒的物品信息
        for (const box of rows) {
            try {
                const [items] = await database_1.default.execute(`SELECT itemName as name, quantity 
                    FROM box_items WHERE boxId = ?`, [box.boxId]);
                box.items = items;
            }
            catch (error) {
                // 获取物品失败时设置为空数组
                box.items = [];
            }
        }
        return rows;
    }
    /**
     * 根据ID获取单个盲盒详情
     * @param boxId 盲盒ID
     * @returns 盲盒详细信息（包含物品列表）
     * @throws 当盲盒不存在时抛出错误
     */
    async getBoxById(boxId) {
        // 获取盲盒基本信息
        const [rows] = await database_1.default.execute(`SELECT * FROM boxes WHERE boxId = ?`, [boxId]);
        if (rows.length === 0) {
            throw new Error('Box not found');
        }
        const box = rows[0];
        // 获取关联物品信息
        const [items] = await database_1.default.execute(`SELECT itemName as name, quantity 
            FROM box_items WHERE boxId = ?`, [boxId]);
        box.items = items;
        return box;
    }
    /**
     * 删除指定盲盒（包括关联物品）
     * @param boxId 要删除的盲盒ID
     * @throws 数据库操作错误
     */
    async deleteBox(boxId) {
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            // 先删除关联物品记录
            await connection.execute(`DELETE FROM box_items WHERE boxId = ?`, [boxId]);
            // 再删除盲盒记录
            await connection.execute(`DELETE FROM boxes WHERE boxId = ?`, [boxId]);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    /**
     * 获取盲盒中可用的物品列表（库存>0）
     * @param boxId 盲盒ID
     * @returns 可用物品数组
     */
    async getAvailableItems(boxId) {
        const [items] = await database_1.default.execute(`SELECT itemName as name, quantity 
            FROM box_items 
            WHERE boxId = ? AND quantity > 0`, [boxId]);
        return items;
    }
    /**
     * 减少指定物品的库存数量
     * @param boxId 盲盒ID
     * @param itemName 物品名称
     * @throws 当物品不存在或库存不足时可能失败
     */
    async decrementItemQuantity(boxId, itemName) {
        await database_1.default.execute(`UPDATE box_items 
            SET quantity = quantity - 1 
            WHERE boxId = ? AND itemName = ? AND quantity > 0`, [boxId, itemName]);
    }
    /**
     * 减少盲盒总库存数量
     * @param boxId 盲盒ID
     * @returns 更新后的盲盒库存数量
     * @throws 当盲盒不存在或库存不足时可能失败
     */
    async decrementBoxQuantity(boxId) {
        // 减少盲盒总库存
        await database_1.default.execute(`UPDATE boxes 
            SET boxNum = boxNum - 1 
            WHERE boxId = ? AND boxNum > 0`, [boxId]);
        // 查询更新后的库存值
        const [rows] = await database_1.default.execute(`SELECT boxNum FROM boxes WHERE boxId = ?`, [boxId]);
        return rows[0].boxNum;
    }
}
exports.default = new BoxModel();
