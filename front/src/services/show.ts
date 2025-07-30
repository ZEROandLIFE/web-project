import api from './api';

/**
 * 分享内容类型
 * @property {number} showId - 分享ID
 * @property {number} userId - 发布用户ID
 * @property {string} username - 发布用户名
 * @property {string} [userAvatar] - 用户头像URL（可选）
 * @property {string} description - 分享描述
 * @property {string} imageUrl - 分享图片URL
 * @property {string} createdAt - 创建时间(ISO格式字符串)
 */
export interface Show {
    showId: number;
    userId: number;
    username: string;
    userAvatar?: string;
    description: string;
    imageUrl: string;
    createdAt: string;
}

/**
 * 评论类型
 * @property {number} commentId - 评论ID
 * @property {number} showId - 关联的分享ID
 * @property {number} userId - 评论用户ID
 * @property {string} username - 评论用户名
 * @property {string} [userAvatar] - 用户头像URL（可选）
 * @property {string} content - 评论内容
 * @property {string} createdAt - 创建时间(ISO格式字符串)
 */
export interface Comment {
    commentId: number;
    showId: number;
    userId: number;
    username: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
}

/**
 * 创建新的分享内容
 * @param {FormData} formData - 包含分享数据的FormData对象
 * @param {string} formData.description - 分享描述
 * @param {File} formData.image - 分享图片文件
 * @returns {Promise<Show>} 创建成功的分享对象
 * @throws {Error} 当创建失败时抛出错误
 */
export const createShow = async (formData: FormData): Promise<Show> => {
    const response = await api.post('/shows/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * 获取所有分享内容（按创建时间倒序）
 * @returns {Promise<Show[]>} 分享内容数组
 * @throws {Error} 当获取失败时抛出错误
 */
export const getAllShows = async (): Promise<Show[]> => {
    const response = await api.get('/shows/all');
    return response.data;
};

/**
 * 在分享下创建评论
 * @param {Object} commentData - 评论数据
 * @param {number} commentData.showId - 目标分享ID
 * @param {string} commentData.content - 评论内容
 * @returns {Promise<Comment>} 创建成功的评论对象
 * @throws {Error} 当创建失败时抛出错误
 */
export const createComment = async (commentData: {
    showId: number;
    content: string;
}): Promise<Comment> => {
    const response = await api.post('/shows/comment', commentData);
    return response.data;
};

/**
 * 获取指定分享的所有评论（按创建时间升序）
 * @param {number} showId - 目标分享ID
 * @returns {Promise<Comment[]>} 评论数组
 * @throws {Error} 当获取失败时抛出错误
 */
export const getComments = async (showId: number): Promise<Comment[]> => {
    const response = await api.get(`/shows/${showId}/comments`);
    return response.data;
};