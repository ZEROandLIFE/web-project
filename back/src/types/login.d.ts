export interface LoginInput {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        phone: string;
        avatar?: string;
    };
}