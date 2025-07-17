import pool from '../config/database';
import { User, UserInput } from '../types/register';

class UserModel {
    async createUser(userData: UserInput): Promise<User> {
        const { username, password, phone, avatar = 'default-avatar.png', address = '',money = 0 } = userData;
        
        const [result] = await pool.execute(
        'INSERT INTO users (username, password, phone, avatar, address, money) VALUES (?, ?, ?, ?, ?, ?)',
        [username, password, phone, avatar, address, money]
    );
    return this.getUserById((result as any).insertId)!;
    }

   async getUserById(id: number): Promise<User> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    const user = (rows as User[])[0];
    
    if (!user) {
        throw new Error('User not found'); // 抛出错误
    }
    
    return user;
}

    async getUserByUsername(username: string): Promise<User | null> {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return (rows as User[])[0] || null;
    }

    async getUserByPhone(phone: string): Promise<User | null> {
        const [rows] = await pool.execute('SELECT * FROM users WHERE phone = ?', [phone]);
        return (rows as User[])[0] || null;
    }

    async updateMoney(userId: number, amount: number): Promise<void> {
    await pool.execute(
        'UPDATE users SET money = money + ? WHERE id = ?',
        [amount, userId]
    );
    }
    async updateProfile(userId: number, profileData: {
    username?: string;
    address?: string;
    }): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];

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

    await pool.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        params
    );
}

    async changePassword(userId: number, newPassword: string): Promise<void> {
        console.log(3)
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [newPassword, userId]
        );
        console.log(4)
    }
}

export default new UserModel();