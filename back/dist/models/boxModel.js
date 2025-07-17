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
            console.log(2);
            const [boxResult] = await connection.execute(`INSERT INTO boxes 
                (boxName, boxDescription, boxNum, boxAvatar, price, userId) 
                VALUES (?, ?, ?, ?, ?, ?)`, [boxName, boxDescription, boxNum, boxAvatar || null, price, userId]);
            console.log(3);
            const boxId = boxResult.insertId;
            // 插入盲盒物品
            for (const item of items) {
                await connection.execute(`INSERT INTO box_items 
                    (boxId, itemName, quantity) 
                    VALUES (?, ?, ?)`, [boxId, item.name, item.quantity]);
            }
            console.log(4);
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
        console.log("进来了model");
        const [rows] = await database_1.default.execute(`SELECT * FROM boxes ORDER BY created_at DESC`);
        console.log("到这没错");
        // 获取每个盲盒的物品
        for (const box of rows) {
            try {
                console.log("当前 box:", box);
                const [items] = await database_1.default.execute(`SELECT itemName as name, quantity 
                    FROM boxItems WHERE boxId = ?`, [box.boxId]);
                box.items = items;
            }
            catch (error) {
                console.error("查询 box_items 时出错:", error);
                box.items = [];
            }
        }
        console.log(rows);
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
}
exports.default = new BoxModel();
