import pool from '../config/database';
import { User, UserInput } from '../types/register';

/**
 * 用户数据模型类，负责与用户相关的数据库操作
 */
class UserModel {
    /**
     * 创建新用户
     * @param userData - 用户输入数据
     * @returns 创建成功的用户对象（包含生成的ID）
     * @throws 当用户创建失败时抛出错误
     */
    async createUser(userData: UserInput): Promise<User> {
        const { username, password, phone, avatar = 'default-avatar.png', address = '', money = 0, role = 'user' } = userData;
        
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, phone, avatar, address, money, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, password, phone, avatar, address, money, role]
        );
        return this.getUserById((result as any).insertId)!;
    }

    /**
     * 根据用户ID获取用户信息
     * @param id - 用户ID
     * @returns 用户对象
     * @throws 当用户不存在时抛出错误
     */
    async getUserById(id: number): Promise<User> {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        const user = (rows as User[])[0];
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    }

    /**
     * 根据用户名获取用户信息
     * @param username - 用户名
     * @returns 用户对象或null（如果用户不存在）
     */
    async getUserByUsername(username: string): Promise<User | null> {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return (rows as User[])[0] || null;
    }

    /**
     * 根据手机号获取用户信息
     * @param phone - 用户手机号
     * @returns 用户对象或null（如果用户不存在）
     */
    async getUserByPhone(phone: string): Promise<User | null> {
        const [rows] = await pool.execute('SELECT * FROM users WHERE phone = ?', [phone]);
        return (rows as User[])[0] || null;
    }

    /**
     * 更新用户余额
     * @param userId - 用户ID
     * @param amount - 要增加的金额（可为负数表示减少）
     */
    async updateMoney(userId: number, amount: number): Promise<void> {
        await pool.execute(
            'UPDATE users SET money = money + ? WHERE id = ?',
            [amount, userId]
        );
    }

    /**
     * 更新用户资料（用户名和地址）
     * @param userId - 用户ID
     * @param profileData - 包含要更新的字段的对象
     * @throws 当没有提供可更新字段时抛出错误
     */
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

    /**
     * 修改用户密码
     * @param userId - 用户ID
     * @param newPassword - 新密码
     */
    async changePassword(userId: number, newPassword: string): Promise<void> {
        await pool.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [newPassword, userId]
        );
    }

    /**
     * 设置用户角色
     * @param userId - 用户ID
     * @param role - 用户角色 ('user' 或 'admin')
     */
    async setUserRole(userId: number, role: 'user' | 'admin'): Promise<void> {
        await pool.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, userId]
        );
    }
}

export default new UserModel();