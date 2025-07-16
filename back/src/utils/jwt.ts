import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EXPIRES_IN = '1d'; // token有效期1天

export function generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}