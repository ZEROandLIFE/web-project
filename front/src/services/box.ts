import api from './api';

/**
 * 盲盒中的物品项类型
 * @property {string} name - 物品名称
 * @property {number} quantity - 物品数量
 */
export interface BoxItem {
    name: string;
    quantity: number;
}

/**
 * 盲盒类型
 * @property {string} boxId - 盲盒唯一标识ID
 * @property {string} boxName - 盲盒名称
 * @property {number} boxNum - 盲盒总数
 * @property {string} [boxAvatar] - 盲盒头像图片URL（可选）
 * @property {string} [description] - 盲盒描述（可选）
 * @property {number} price - 盲盒价格
 * @property {string} userId - 创建者用户ID
 * @property {BoxItem[]} items - 包含的物品项列表
 */
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

/**
 * 创建新的盲盒
 * @param {Object} boxData - 盲盒数据
 * @param {string} boxData.boxName - 盲盒名称
 * @param {string} boxData.boxDescription - 盲盒描述
 * @param {number} boxData.boxNum - 盲盒数量
 * @param {File} [boxData.boxAvatar] - 盲盒头像图片文件（可选）
 * @param {number} boxData.price - 盲盒价格
 * @param {string} boxData.userId - 创建者用户ID
 * @param {BoxItem[]} boxData.items - 包含的物品项列表
 * @returns {Promise<Box>} 创建成功的盲盒对象
 */
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
    formData.append('boxName', boxData.boxName);
    formData.append('boxDescription', boxData.boxDescription);
    formData.append('boxNum', boxData.boxNum.toString());
    formData.append('price', boxData.price.toString());
    formData.append('userId', boxData.userId);

    if (boxData.boxAvatar) {
        formData.append('boxAvatar', boxData.boxAvatar);
    }

    // 物品项数组需要转为JSON字符串传输
    formData.append('items', JSON.stringify(boxData.items));

    const response = await api.post('/boxes/createbox', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * 获取所有盲盒列表
 * @returns {Promise<Box[]>} 盲盒数组
 */
export const getAllBoxes = async (): Promise<Box[]> => {
    const response = await api.get('/boxes/getallboxes');
    return response.data;
};

/**
 * 根据ID获取单个盲盒详情
 * @param {string} boxId - 盲盒唯一标识ID
 * @returns {Promise<Box>} 盲盒对象
 */
export const getBoxById = async (boxId: string): Promise<Box> => {
    const response = await api.get(`/boxes/${boxId}`);
    return response.data;
};

/**
 * 购买盲盒
 * @param {string} boxId - 要购买的盲盒ID
 * @returns {Promise<Object>} 购买结果对象
 * @property {boolean} success - 是否购买成功
 * @property {BoxItem} item - 获得的物品项
 * @property {number} remaining - 剩余盲盒数量
 * @property {string} message - 操作结果消息
 */
export const purchaseBox = async (boxId: string): Promise<{
    success: boolean;
    item: BoxItem;
    remaining: number;
    message: string;
}> => {
    const response = await api.post(`/boxes/${boxId}/purchase`);
    return response.data;
};

/**
 * 删除盲盒
 * @param {string} boxId - 要删除的盲盒ID
 * @returns {Promise<Object>} 操作结果对象
 * @property {string} message - 操作结果消息
 */
export const deleteBox = async (boxId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/boxes/${boxId}`);
    return response.data;
};