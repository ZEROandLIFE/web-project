"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    async createUser(userData) {
        const { username, password, phone, avatar = 'default-avatar.png', address = '', money = 0 } = userData;
        const [result] = await database_1.default.execute('INSERT INTO users (username, password, phone, avatar, address, money) VALUES (?, ?, ?, ?, ?, ?)', [username, password, phone, avatar, address, money]);
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
}
exports.default = new UserModel();
