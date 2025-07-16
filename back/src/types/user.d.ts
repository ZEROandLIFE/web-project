export interface User {
    id: number;
    username: string;
    password: string;
    phone: string;
    avatar?: string;
    address?: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserInput {
    username: string;
    password: string;
    phone: string;
    avatar?: string;
    address?: string;
}