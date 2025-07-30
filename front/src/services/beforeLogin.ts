import api from './api';
import axios from 'axios';

/**
 * 登录响应数据类型
 * @property {string} token - 认证令牌
 * @property {Object} user - 用户基本信息
 * @property {string} user.id - 用户ID
 * @property {string} user.username - 用户名
 */
interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
    };
}

/**
 * 注册响应数据类型
 * @property {string} message - 操作结果消息
 */
interface RegisterResponse {
    message: string;
}

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<LoginResponse>} 包含token和用户信息的对象
 * @throws {Error} 当登录失败时抛出错误，包含错误信息
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post('/auth/login', { username, password });
        // 登录成功后存储token到本地
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        let message = '用户名或密码错误';
        // 如果是Axios错误，尝试从响应中获取更详细的错误信息
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || message;
        }
        throw new Error(message);
    }
};

/**
 * 用户注册
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @param {string} phone - 手机号
 * @param {File} [avatar] - 用户头像文件（可选）
 * @param {string} [address] - 用户地址（可选）
 * @returns {Promise<RegisterResponse>} 包含操作结果消息的对象
 * @throws {Error} 当注册失败时抛出错误，包含错误信息
 */
export const register = async (
    username: string,
    password: string,
    phone: string,
    avatar?: File,
    address?: string
): Promise<RegisterResponse> => {
    try {
        // 创建表单数据并添加各个字段
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('phone', phone);
        if (avatar) formData.append('avatar', avatar);
        if (address) formData.append('address', address);

        // 发送multipart/form-data格式的注册请求
        const response = await api.post('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('注册错误详情:', error);
        let message = '注册失败';
        // 处理特定错误状态
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || message;
            if (error.response?.status === 409) {
                message = '用户名或手机号已被注册';
            }
        }
        throw new Error(message);
    }
};

/**
 * 用户登出
 * 清除本地存储的认证token
 */
export const logout = () => {
    localStorage.removeItem('token');
};