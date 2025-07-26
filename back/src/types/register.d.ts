export interface User {
    id: number;
    username: string;
    password: string;
    phone: string;
    avatar?: string;
    address?: string;
    money: number;
    created_at: Date;
    updated_at: Date;
    role: 'user' | 'admin';
}

export interface UserInput {
    username: string;
    password: string;
    phone: string;
    avatar?: string;
    address?: string;
    money?: number;
    role?: 'user' | 'admin';
}