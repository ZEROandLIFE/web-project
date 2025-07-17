import pool from '../config/database';
import { Box, BoxInput, BoxItem } from '../types/box';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class BoxModel {
    // 创建盲盒
    async createBox(boxData: BoxInput): Promise<Box> {
        const { boxName, boxDescription, boxNum, boxAvatar, price, userId, items } = boxData;
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // 插入盲盒基本信息\
            console.log(2);
            const [boxResult] = await connection.execute<ResultSetHeader>(
                `INSERT INTO boxes 
                (boxName, boxDescription, boxNum, boxAvatar, price, userId) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [boxName, boxDescription, boxNum, boxAvatar||null, price, userId]
            );
            console.log(3);
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
            console.log(4);
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
        console.log("进来了model");
        const [rows] = await pool.execute<(Box & RowDataPacket)[]>(
            `SELECT * FROM boxes ORDER BY created_at DESC`
        );
        console.log("到这没错");
        // 获取每个盲盒的物品
        for (const box of rows) {
            try {
                console.log("当前 box:", box);
                

                const [items] = await pool.execute<(BoxItem & RowDataPacket)[]>(
                    `SELECT itemName as name, quantity 
                    FROM boxItems WHERE boxId = ?`,
                    [box.boxId] 
                );
                box.items = items;
                } catch (error) {
                    console.error("查询 box_items 时出错:", error);
                    box.items = [];
            }
        }
        console.log(rows);
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
}

export default new BoxModel();