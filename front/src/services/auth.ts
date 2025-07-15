import api from './api';
import axios from 'axios';// { AxiosError }

interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
    };
}
interface RegisterResponse {
    message: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        let message = '用户名或密码错误';
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || message;
        }
        throw new Error(message);
    }
};

export const register = async (formData: FormData): Promise<RegisterResponse> => {
    try {
        const response = await api.post('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('注册失败，用户名可能已被占用');
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};