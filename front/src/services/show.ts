import api from './api';

export interface Show {
    showId: number;
    userId: number;
    username: string;
    userAvatar?: string;
    description: string;
    imageUrl: string;
    createdAt: string;
}

export interface Comment {
    commentId: number;
    showId: number;
    userId: number;
    username: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
}

// 创建分享
export const createShow = async (formData: FormData): Promise<Show> => {
    const response = await api.post('/shows/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// 获取所有分享
export const getAllShows = async (): Promise<Show[]> => {
    const response = await api.get('/shows/all');
    return response.data;
};

// 创建评论
export const createComment = async (commentData: {
    showId: number;
    content: string;
}): Promise<Comment> => {
    const response = await api.post('/shows/comment', commentData);
    return response.data;
};

// 获取评论
export const getComments = async (showId: number): Promise<Comment[]> => {
    const response = await api.get(`/shows/${showId}/comments`);
    return response.data;
};