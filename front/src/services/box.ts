
import api from './api';
interface BoxItem {
    name: string;
    quantity: number;
}

interface Box {
    boxId?: string;
    boxName: string;
    boxNum: number;
    boxAvatar: string;
    price: number;
    userId: string;
    items: BoxItem[];
}

// 创建盲盒
export const createBox = async (boxData: Omit<Box, 'boxId'>): Promise<Box> => {
    const response = await api.post('/boxes', boxData);
    return response.data;
};

// 获取所有盲盒
export const getAllBoxes = async (): Promise<Box[]> => {
    const response = await api.get('/boxes');
    return response.data;
};

// 获取单个盲盒详情
export const getBoxById = async (boxId: string): Promise<Box> => {
    const response = await api.get(`/boxes/${boxId}`);
    return response.data;
};

// 上传盲盒图片
export const uploadBoxImage = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};