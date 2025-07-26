import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// 请求拦截器 - 确保正确添加 token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        // 确保格式正确：Bearer <token>
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 响应拦截器
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 获取当前用户信息
export const fetchCurrentUser = async () => {
    try {

        const response = await api.get('/auth/current');
        return response.data;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error; // 抛出错误让调用方处理
    }
};
export const rechargeMoney = async (amount: number): Promise<{ success: boolean; newBalance: number }> => {
    try {
        const response = await api.post('/auth/recharge', { amount });
        return response.data;
    } catch (error) {
        console.error('充值失败:', error);
        throw error;
    }
};

export const getBalance = async (): Promise<{ balance: number }> => {
    try {
        const response = await api.get('/auth/balance');
        return response.data;
    } catch (error) {
        console.error('获取余额失败:', error);
        throw error;
    }
};
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
export const setAdminRole = async (
    userId: number,
): Promise<{ success: boolean; user: any }> => {
    try {
        console.log(userId);
        const response = await api.put(`/auth/admin/${userId}`);
        return response.data;
    } catch (error) {
        console.error('设置管理员权限失败:', error);
        throw error;
    }
};
export default api;