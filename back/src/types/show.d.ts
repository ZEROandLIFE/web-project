export interface Show {
    showId?: number;
    userId: number;
    username: string;
    userAvatar?: string;
    description: string;
    imageUrl: string;
    createdAt?: Date;
}

export interface Comment {
    commentId?: number;
    showId: number;
    userId: number;
    username: string;
    userAvatar?: string;
    content: string;
    createdAt?: Date;
}