import { Request, Response } from 'express';
import RegisterService from '../services/registerService';
import { UserInput } from '../types/register';
import ImageService from '../services/imageService';

/**
 * 用户注册控制器
 * 处理用户注册相关请求
 */
class RegisterController {
    /**
     * 处理用户注册请求
     * @param req 请求对象，包含用户注册信息和可选的头像文件
     * @param res 响应对象
     * @bodyParam username 用户名（必填）
     * @bodyParam password 密码（必填）
     * @bodyParam phone 手机号（必填）
     * @bodyParam address 地址（可选）
     * @file avatar 用户头像文件（可选）
     * @response 201 注册成功，返回用户基本信息
     * @response 409 用户名或手机号已存在
     * @response 500 服务器内部错误
     */
    async register(req: Request, res: Response) {
        try {
            // 1. 解析请求数据
            const { username, password, phone, address } = req.body;
            const avatar = req.file; // 获取上传的头像文件

            // 2. 处理头像上传（如果提供了头像文件）
            let avatarUrl = 'default-avatar.png';
            if (avatar) {
                avatarUrl = await ImageService.uploadImage(req); // 使用ImageService上传图片
            }

            // 3. 调用服务层进行用户注册
            const newUser = await RegisterService.register({
                username,
                password,
                phone,
                address,
                avatar: avatar ? avatarUrl : undefined
            });

            // 4. 返回成功响应
            res.status(201).json({
                message: '注册成功',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    phone: newUser.phone,
                    address: newUser.address,
                    avatar: newUser.avatar || 'default-avatar.png'
                }
            });
        } catch (error: any) {
            console.error('注册错误:', error);

            // 根据错误类型返回不同的状态码
            if (error.message === 'Username already exists') {
                res.status(409).json({ error: '用户名已存在' });
            } else if (error.message === 'Phone number already exists') {
                res.status(409).json({ error: '手机号已注册' });
            } else {
                res.status(500).json({ error: '注册失败' });
            }
        }
    }
}

export default new RegisterController();