import UserModel from '../models/user';
import { comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { LoginInput, LoginResponse } from '../types/login';

class LoginService {
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

        // 3. 生成token
        const token = generateToken({
            userId: user.id,
            username: user.username
        });

        // 4. 返回响应数据
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