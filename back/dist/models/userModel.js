"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    async createUser(userData) {
        const { username, password, phone, avatar = 'default-avatar.png', address = '', money = 0, role = 'user' } = userData;
        const [result] = await database_1.default.execute('INSERT INTO users (username, password, phone, avatar, address, money,role) VALUES (?, ?, ?, ?, ?, ?,?)', [username, password, phone, avatar, address, money, role]);
        return this.getUserById(result.insertId);
    }
    async getUserById(id) {
        const [rows] = await database_1.default.execute('SELECT * FROM users WHERE id = ?', [id]);
        const user = rows[0];
        if (!user) {
            throw new Error('User not found'); // 抛出错误
        }
        return user;
    }
    async getUserByUsername(username) {
        const [rows] = await database_1.default.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    }
    async getUserByPhone(phone) {
        const [rows] = await database_1.default.execute('SELECT * FROM users WHERE phone = ?', [phone]);
        return rows[0] || null;
    }
    async updateMoney(userId, amount) {
        await database_1.default.execute('UPDATE users SET money = money + ? WHERE id = ?', [amount, userId]);
    }
    async updateProfile(userId, profileData) {
        const updates = [];
        const params = [];
        if (profileData.username !== undefined) {
            updates.push('username = ?');
            params.push(profileData.username);
        }
        if (profileData.address !== undefined) {
            updates.push('address = ?');
            params.push(profileData.address);
        }
        if (updates.length === 0) {
            throw new Error('没有可更新的字段');
        }
        params.push(userId);
        await database_1.default.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    }
    async changePassword(userId, newPassword) {
        await database_1.default.execute('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);
    }
    async setUserRole(userId, role) {
        await database_1.default.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    }
}
exports.default = new UserModel();
