
import api from './api';
export interface BoxItem {
    name: string;
    quantity: number;
}

export interface Box {
    boxId: string;
    boxName: string;
    boxNum: number;
    boxAvatar?: string;
    description?: string;
    price: number;
    userId: string;
    items: BoxItem[];
}

// 创建盲盒
export const createBox = async (boxData: Omit<Box, 'boxId'>& { boxAvatar?: string }): Promise<Box> => {
    const response = await api.post('/boxes/createbox', boxData);
    return response.data;
};

// 获取所有盲盒
export const getAllBoxes = async (): Promise<Box[]> => {
    const response = await api.get('/boxes/getallboxes');
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

    const response = await api.post('/boxes/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
//购买盲盒
export const purchaseBox = async (boxId: string): Promise<{
    success: boolean;
    item: BoxItem;
    remaining: number;
    message: string;
}> => {
    const response = await api.post(`/boxes/${boxId}/purchase`);
    return response.data;
};
// 删除盲盒
export const deleteBox = async (boxId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/boxes/${boxId}`);
    return response.data;
};