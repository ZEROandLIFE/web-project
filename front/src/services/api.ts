// api.ts
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
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 获取当前用户信息
export const fetchCurrentUser = async () => {
    try {
        
        const response = await api.get('/current');
        return response.data;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error; // 抛出错误让调用方处理
    }
};

export default api;