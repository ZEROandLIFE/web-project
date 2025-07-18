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

// 创建盲盒（修改为使用FormData）
export const createBox = async (boxData: {
    boxName: string;
    boxDescription: string;
    boxNum: number;
    boxAvatar?: File;
    price: number;
    userId: string;
    items: BoxItem[];
}): Promise<Box> => {
    const formData = new FormData();
    console.log(boxData);
    formData.append('boxName', boxData.boxName);
    formData.append('boxDescription', boxData.boxDescription);
    formData.append('boxNum', boxData.boxNum.toString());
    formData.append('price', boxData.price.toString());
    formData.append('userId', boxData.userId);

    if (boxData.boxAvatar) {
        formData.append('boxAvatar', boxData.boxAvatar);
    }

    formData.append('items', JSON.stringify(boxData.items));
    console.log("函数调用",formData);
    const response = await api.post('/boxes/createbox', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// 其他函数保持不变...
export const getAllBoxes = async (): Promise<Box[]> => {
    const response = await api.get('/boxes/getallboxes');
    return response.data;
};

export const getBoxById = async (boxId: string): Promise<Box> => {
    const response = await api.get(`/boxes/${boxId}`);
    return response.data;
};

export const purchaseBox = async (boxId: string): Promise<{
    success: boolean;
    item: BoxItem;
    remaining: number;
    message: string;
}> => {
    const response = await api.post(`/boxes/${boxId}/purchase`);
    return response.data;
};

export const deleteBox = async (boxId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/boxes/${boxId}`);
    return response.data;
};