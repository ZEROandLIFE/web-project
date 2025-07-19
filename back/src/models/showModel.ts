import pool from '../config/database';
import { Show, Comment } from '../types/show';

class ShowModel {
    // 创建分享
    async createShow(showData: Show): Promise<Show> {
        const [result] = await pool.execute(
            `INSERT INTO shows 
            (userId, username, userAvatar, description, imageUrl) 
            VALUES (?, ?, ?, ?, ?)`,
            [showData.userId, showData.username, showData.userAvatar, 
             showData.description, showData.imageUrl]
        );
        return this.getShowById((result as any).insertId);
    }

    // 获取所有分享
    async getAllShows(): Promise<Show[]> {
        const [rows] = await pool.execute('SELECT * FROM shows ORDER BY createdAt DESC');
        return rows as Show[];
    }

    // 获取单个分享
    async getShowById(showId: number): Promise<Show> {
        const [rows] = await pool.execute('SELECT * FROM shows WHERE showId = ?', [showId]);
        return (rows as Show[])[0];
    }

    // 创建评论
    async createComment(commentData: Comment): Promise<Comment> {
        const [result] = await pool.execute(
            `INSERT INTO comments 
            (showId, userId, username, userAvatar, content) 
            VALUES (?, ?, ?, ?, ?)`,
            [commentData.showId, commentData.userId, commentData.username, 
             commentData.userAvatar, commentData.content]
        );
        return this.getCommentById((result as any).insertId);
    }

    // 获取评论
    async getCommentsByShowId(showId: number): Promise<Comment[]> {
        const [rows] = await pool.execute(
            'SELECT * FROM comments WHERE showId = ? ORDER BY createdAt ASC',
            [showId]
        );
        return rows as Comment[];
    }

    // 获取单个评论
    async getCommentById(commentId: number): Promise<Comment> {
        const [rows] = await pool.execute('SELECT * FROM comments WHERE commentId = ?', [commentId]);
        return (rows as Comment[])[0];
    }
}

export default new ShowModel();