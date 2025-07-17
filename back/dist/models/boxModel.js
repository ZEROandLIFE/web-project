"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class BoxModel {
    // 创建盲盒
    async createBox(boxData) {
        const { boxName, boxDescription, boxNum, boxAvatar, price, userId, items } = boxData;
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            // 插入盲盒基本信息\
            const [boxResult] = await connection.execute(`INSERT INTO boxes 
                (boxName, boxDescription, boxNum, boxAvatar, price, userId) 
                VALUES (?, ?, ?, ?, ?, ?)`, [boxName, boxDescription, boxNum, boxAvatar || null, price, userId]);
            const boxId = boxResult.insertId;
            // 插入盲盒物品
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
    // 获取所有盲盒
    async getAllBoxes() {
        const [rows] = await database_1.default.execute(`SELECT * FROM boxes ORDER BY created_at DESC`);
        // 获取每个盲盒的物品
        for (const box of rows) {
            try {
                const [items] = await database_1.default.execute(`SELECT itemName as name, quantity 
                    FROM box_items WHERE boxId = ?`, [box.boxId]);
                box.items = items;
            }
            catch (error) {
                box.items = [];
            }
        }
        return rows;
    }
    // 根据ID获取盲盒
    async getBoxById(boxId) {
        const [rows] = await database_1.default.execute(`SELECT * FROM boxes WHERE boxId = ?`, [boxId]);
        if (rows.length === 0) {
            throw new Error('Box not found');
        }
        const box = rows[0];
        // 获取盲盒物品
        const [items] = await database_1.default.execute(`SELECT itemName as name, quantity 
            FROM box_items WHERE boxId = ?`, [boxId]);
        box.items = items;
        return box;
    }
    // 删除盲盒
    async deleteBox(boxId) {
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            // 先删除关联的物品
            await connection.execute(`DELETE FROM box_items WHERE boxId = ?`, [boxId]);
            // 再删除盲盒
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
    async getAvailableItems(boxId) {
        const [items] = await database_1.default.execute(`SELECT itemName as name, quantity 
            FROM box_items 
            WHERE boxId = ? AND quantity > 0`, [boxId]);
        return items;
    }
    async decrementItemQuantity(boxId, itemName) {
        await database_1.default.execute(`UPDATE box_items 
            SET quantity = quantity - 1 
            WHERE boxId = ? AND itemName = ? AND quantity > 0`, [boxId, itemName]);
    }
    async decrementBoxQuantity(boxId) {
        await database_1.default.execute(`UPDATE boxes 
            SET boxNum = boxNum - 1 
            WHERE boxId = ? AND boxNum > 0`, [boxId]);
        const [rows] = await database_1.default.execute(`SELECT boxNum FROM boxes WHERE boxId = ?`, [boxId]);
        return rows[0].boxNum;
    }
}
exports.default = new BoxModel();
