import axios from 'axios';

/**
 * 创建API实例，配置基础URL
 * 使用环境变量VITE_API_URL，若不存在则默认使用'http://localhost:3000/api'
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

/**
 * 请求拦截器
 * 自动为请求添加Bearer Token认证头
 */
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * 响应拦截器
 * 处理401未授权响应，清除本地token
 */
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // 可选：重定向到登录页
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * 获取当前登录用户信息
 * @returns {Promise<Object>} 用户信息对象
 * @throws {Error} 当请求失败时抛出错误
 */
export const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/auth/current');
        return response.data;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
};

/**
 * 账户充值
 * @param {number} amount - 充值金额
 * @returns {Promise<{success: boolean, newBalance: number}>} 操作结果及新余额
 * @throws {Error} 当请求失败时抛出错误
 */
export const rechargeMoney = async (amount: number): Promise<{ success: boolean; newBalance: number }> => {
    try {
        const response = await api.post('/auth/recharge', { amount });
        return response.data;
    } catch (error) {
        console.error('充值失败:', error);
        throw error;
    }
};

/**
 * 获取账户余额
 * @returns {Promise<{balance: number}>} 包含余额的对象
 * @throws {Error} 当请求失败时抛出错误
 */
export const getBalance = async (): Promise<{ balance: number }> => {
    try {
        const response = await api.get('/auth/balance');
        return response.data;
    } catch (error) {
        console.error('获取余额失败:', error);
        throw error;
    }
};

/**
 * 更新用户个人信息
 * @param {Object} profileData - 包含可更新字段的对象
 * @param {string} [profileData.username] - 新用户名（可选）
 * @param {string} [profileData.address] - 新地址（可选）
 * @returns {Promise<{success: boolean, user: Object}>} 操作结果及更新后的用户信息
 * @throws {Error} 当请求失败时抛出错误
 */
export const updateProfile = async (profileData: {
    username?: string;
    address?: string;
}): Promise<{ success: boolean; user: any }> => {
    try {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('更新个人信息失败:', error);
        throw error;
    }
};

/**
 * 修改用户密码
 * @param {Object} passwords - 密码对象
 * @param {string} passwords.newPassword - 新密码
 * @param {string} passwords.confirmPassword - 确认密码
 * @returns {Promise<{success: boolean, message: string}>} 操作结果及消息
 * @throws {Error} 当请求失败时抛出错误
 */
export const changePassword = async (passwords: {
    newPassword: string;
    confirmPassword: string;
}): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await api.put('/auth/password', passwords);
        return response.data;
    } catch (error) {
        console.error('修改密码失败:', error);
        throw error;
    }
};

/**
 * 设置用户为管理员
 * @param {number} userId - 目标用户ID
 * @returns {Promise<{success: boolean, user: Object}>} 操作结果及更新后的用户信息
 * @throws {Error} 当请求失败时抛出错误
 */
export const setAdminRole = async (
    userId: number,
): Promise<{ success: boolean; user: any }> => {
    try {
        console.log(userId); // 调试日志，可移除
        const response = await api.put(`/auth/admin/${userId}`);
        return response.data;
    } catch (error) {
        console.error('设置管理员权限失败:', error);
        throw error;
    }
};

export default api;