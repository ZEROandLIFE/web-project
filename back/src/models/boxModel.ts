import pool from '../config/database';
import { Box, BoxInput, BoxItem } from '../types/box';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class BoxModel {
    // 创建盲盒
    async createBox(boxData: BoxInput): Promise<Box> {
        const { boxName, boxDescription, boxNum, boxAvatar, price, userId, items } = boxData;
        console.log(boxAvatar)
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // 插入盲盒基本信息\
            const [boxResult] = await connection.execute<ResultSetHeader>(
                `INSERT INTO boxes 
                (boxName, boxDescription, boxNum, boxAvatar, price, userId) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [boxName, boxDescription, boxNum, boxAvatar||null, price, userId]
            );
            const boxId = boxResult.insertId;
            // 插入盲盒物品
            for (const item of items) {
                await connection.execute<ResultSetHeader>(
                    `INSERT INTO box_items 
                    (boxId, itemName, quantity) 
                    VALUES (?, ?, ?)`,
                    [boxId, item.name, item.quantity]
                );
            }
            await connection.commit();
            return this.getBoxById(boxId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // 获取所有盲盒
    async getAllBoxes(): Promise<Box[]> {
        const [rows] = await pool.execute<(Box & RowDataPacket)[]>(
            `SELECT * FROM boxes ORDER BY created_at DESC`
        );
        // 获取每个盲盒的物品
        for (const box of rows) {
            try {
                const [items] = await pool.execute<(BoxItem & RowDataPacket)[]>(
                    `SELECT itemName as name, quantity 
                    FROM box_items WHERE boxId = ?`,
                    [box.boxId] 
                );
                box.items = items;
                } catch (error) {
                    box.items = [];
            }
        }
        return rows;
    }

    // 根据ID获取盲盒
    async getBoxById(boxId: number): Promise<Box> {
        const [rows] = await pool.execute<(Box & RowDataPacket)[]>(
            `SELECT * FROM boxes WHERE boxId = ?`,
            [boxId]
        );
        
        if (rows.length === 0) {
            throw new Error('Box not found');
        }
        
        const box = rows[0];
        
        // 获取盲盒物品
        const [items] = await pool.execute<(BoxItem & RowDataPacket)[]>(
            `SELECT itemName as name, quantity 
            FROM box_items WHERE boxId = ?`,
            [boxId]
        );
        
        box.items = items;
        return box;
    }
    // 删除盲盒
    async deleteBox(boxId: number): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // 先删除关联的物品
            await connection.execute(
                `DELETE FROM box_items WHERE boxId = ?`,
                [boxId]
            );
            
            // 再删除盲盒
            await connection.execute(
                `DELETE FROM boxes WHERE boxId = ?`,
                [boxId]
            );
            
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    async getAvailableItems(boxId: number): Promise<BoxItem[]> {
        const [items] = await pool.execute<(BoxItem & RowDataPacket)[]>(
            `SELECT itemName as name, quantity 
            FROM box_items 
            WHERE boxId = ? AND quantity > 0`,
            [boxId]
        );
        return items;
    }

    async decrementItemQuantity(
        boxId: number, 
        itemName: string
    ): Promise<void> {
        await pool.execute(
            `UPDATE box_items 
            SET quantity = quantity - 1 
            WHERE boxId = ? AND itemName = ? AND quantity > 0`,
            [boxId, itemName]
        );
    }

    async decrementBoxQuantity(boxId: number): Promise<number> {
        await pool.execute(
            `UPDATE boxes 
            SET boxNum = boxNum - 1 
            WHERE boxId = ? AND boxNum > 0`,
            [boxId]
        );
        
        const [rows] = await pool.execute<(Box & RowDataPacket)[]>(
            `SELECT boxNum FROM boxes WHERE boxId = ?`,
            [boxId]
        );
        
        return rows[0].boxNum;
    }
}

export default new BoxModel();