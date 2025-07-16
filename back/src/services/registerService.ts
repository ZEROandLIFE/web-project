import UserModel from '../models/user';
import { hashPassword } from '../utils/bcrypt';
import { UserInput } from '../types/register';

class RegisterService {
    async register(userData: UserInput) {
        const { username, phone, password } = userData;
        
        // 检查用户名是否已存在
        const existingUser = await UserModel.getUserByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // 检查手机号是否已存在
        const existingPhone = await UserModel.getUserByPhone(phone);
        if (existingPhone) {
            throw new Error('Phone number already exists');
        }

        // 加密密码
        const hashedPassword = await hashPassword(password);

        // 创建用户
        return UserModel.createUser({
            ...userData,
            password: hashedPassword
        });
    }
}

export default new RegisterService();