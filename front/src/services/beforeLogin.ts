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

export const register = async (
    username: string,
    password: string,
    phone: string,
    avatar?: File,
    address?: string
): Promise<RegisterResponse> => {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('phone', phone);
        if (avatar) formData.append('avatar', avatar);
        if (address) formData.append('address', address);

        const response = await api.post('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('注册错误详情:', error);
        let message = '注册失败';
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || message;
            if (error.response?.status === 409) {
                message = '用户名或手机号已被注册';
            }
        }
        throw new Error(message);
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};