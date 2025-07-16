import pool from '../config/database';
import { User, UserInput } from '../types/user';

class UserModel {
    async createUser(userData: UserInput): Promise<User> {
        const { username, password, phone, avatar = 'default-avatar.png', address = '' } = userData;
        
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, phone, avatar, address) VALUES (?, ?, ?, ?, ?)',
            [username, password, phone, avatar, address]
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
}

export default new UserModel();