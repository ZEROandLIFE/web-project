import UserModel from '../models/userModel';
import { comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { LoginInput, LoginResponse } from '../types/login';

/**
 * 用户登录服务
 * @class LoginService
 * @description 处理用户登录相关业务逻辑
 */
class LoginService {
    /**
     * 用户登录方法
     * @async
     * @param {LoginInput} loginData - 用户登录输入数据
     * @returns {Promise<LoginResponse>} 包含用户信息和token的登录响应数据
     * @throws {Error} 当用户不存在或密码错误时抛出异常
     */
    async login(loginData: LoginInput): Promise<LoginResponse> {
        const { username, password } = loginData;
        
        // 1. 检查用户是否存在
        const user = await UserModel.getUserByUsername(username);
        if (!user) {
            throw new Error('用户不存在');
        }

        // 2. 验证密码
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('密码错误');
        }

        // 3. 生成JWT token
        const token = generateToken({
            userId: user.id,
            username: user.username
        });

        // 4. 构造响应数据（过滤敏感字段）
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                avatar: user.avatar
            }
        };
    }
}

export default new LoginService();