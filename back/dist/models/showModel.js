"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class ShowModel {
    // 创建分享
    async createShow(showData) {
        const [result] = await database_1.default.execute(`INSERT INTO shows 
            (userId, username, userAvatar, description, imageUrl) 
            VALUES (?, ?, ?, ?, ?)`, [showData.userId, showData.username, showData.userAvatar,
            showData.description, showData.imageUrl]);
        return this.getShowById(result.insertId);
    }
    // 获取所有分享
    async getAllShows() {
        const [rows] = await database_1.default.execute('SELECT * FROM shows ORDER BY createdAt DESC');
        return rows;
    }
    // 获取单个分享
    async getShowById(showId) {
        const [rows] = await database_1.default.execute('SELECT * FROM shows WHERE showId = ?', [showId]);
        return rows[0];
    }
    // 创建评论
    async createComment(commentData) {
        const [result] = await database_1.default.execute(`INSERT INTO comments 
            (showId, userId, username, userAvatar, content) 
            VALUES (?, ?, ?, ?, ?)`, [commentData.showId, commentData.userId, commentData.username,
            commentData.userAvatar, commentData.content]);
        return this.getCommentById(result.insertId);
    }
    // 获取评论
    async getCommentsByShowId(showId) {
        const [rows] = await database_1.default.execute('SELECT * FROM comments WHERE showId = ? ORDER BY createdAt ASC', [showId]);
        return rows;
    }
    // 获取单个评论
    async getCommentById(commentId) {
        const [rows] = await database_1.default.execute('SELECT * FROM comments WHERE commentId = ?', [commentId]);
        return rows[0];
    }
}
exports.default = new ShowModel();
