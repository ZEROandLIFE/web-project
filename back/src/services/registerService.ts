import UserModel from '../models/userModel';
import { hashPassword } from '../utils/bcrypt';
import { UserInput } from '../types/register';

/**
 * 用户注册服务
 * @class RegisterService
 * @description 处理用户注册相关业务逻辑，包括数据验证和用户创建
 */
class RegisterService {
    /**
     * 用户注册方法
     * @async
     * @param {UserInput} userData - 用户注册数据
     * @returns {Promise<Object>} 创建成功的用户对象
     * @throws {Error} 当用户名或手机号已存在时抛出异常
     * @description 
     * 1. 验证用户名唯一性
     * 2. 验证手机号唯一性
     * 3. 加密密码
     * 4. 创建新用户
     */
    async register(userData: UserInput) {
        const { username, phone, password } = userData;
        
        // 验证用户名唯一性
        const existingUser = await UserModel.getUserByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // 验证手机号唯一性
        const existingPhone = await UserModel.getUserByPhone(phone);
        if (existingPhone) {
            throw new Error('Phone number already exists');
        }

        // 加密密码
        const hashedPassword = await hashPassword(password);

        // 创建用户（使用扩展运算符保留其他用户数据）
        return UserModel.createUser({
            ...userData,
            password: hashedPassword
        });
    }
}

export default new RegisterService();