"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
/**
 * 分享内容数据模型类，负责与分享和评论相关的数据库操作
 */
class ShowModel {
    /**
     * 创建新的分享内容
     * @param showData - 分享内容数据对象
     * @returns 创建成功的分享内容对象（包含生成的ID）
     */
    async createShow(showData) {
        const [result] = await database_1.default.execute(`INSERT INTO shows 
            (userId, username, userAvatar, description, imageUrl) 
            VALUES (?, ?, ?, ?, ?)`, [showData.userId, showData.username, showData.userAvatar,
            showData.description, showData.imageUrl]);
        return this.getShowById(result.insertId);
    }
    /**
     * 获取所有分享内容（按创建时间降序排列）
     * @returns 分享内容对象数组
     */
    async getAllShows() {
        const [rows] = await database_1.default.execute('SELECT * FROM shows ORDER BY createdAt DESC');
        return rows;
    }
    /**
     * 根据ID获取单个分享内容
     * @param showId - 分享内容ID
     * @returns 对应的分享内容对象
     */
    async getShowById(showId) {
        const [rows] = await database_1.default.execute('SELECT * FROM shows WHERE showId = ?', [showId]);
        return rows[0];
    }
    /**
     * 创建新的评论
     * @param commentData - 评论数据对象
     * @returns 创建成功的评论对象（包含生成的ID）
     */
    async createComment(commentData) {
        const [result] = await database_1.default.execute(`INSERT INTO comments 
            (showId, userId, username, userAvatar, content) 
            VALUES (?, ?, ?, ?, ?)`, [commentData.showId, commentData.userId, commentData.username,
            commentData.userAvatar, commentData.content]);
        return this.getCommentById(result.insertId);
    }
    /**
     * 根据分享ID获取所有评论（按创建时间升序排列）
     * @param showId - 关联的分享内容ID
     * @returns 评论对象数组
     */
    async getCommentsByShowId(showId) {
        const [rows] = await database_1.default.execute('SELECT * FROM comments WHERE showId = ? ORDER BY createdAt ASC', [showId]);
        return rows;
    }
    /**
     * 根据ID获取单个评论
     * @param commentId - 评论ID
     * @returns 对应的评论对象
     */
    async getCommentById(commentId) {
        const [rows] = await database_1.default.execute('SELECT * FROM comments WHERE commentId = ?', [commentId]);
        return rows[0];
    }
}
exports.default = new ShowModel();
