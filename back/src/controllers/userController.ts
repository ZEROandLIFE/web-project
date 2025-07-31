import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import UserService from '../services/userService';

/**
 * 获取当前登录用户信息
 * @param req 请求对象（包含认证用户信息）
 * @param res 响应对象
 * @response 200 返回用户信息（不含密码）
 * @response 404 用户不存在
 * @response 500 服务器错误
 */
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        // 从认证中间件附加的用户信息中获取ID
        const userId = (req as any).user.id;
        
        // 查询用户信息
        const user = await UserModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }

        // 排除密码字段后返回
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: '服务器错误' });
    }
};

/**
 * 用户账户充值
 * @param req 请求对象（包含认证用户信息和充值金额）
 * @param res 响应对象
 * @bodyParam amount 充值金额（必须大于0）
 * @response 200 返回充值后的余额
 * @response 400 参数错误
 */
export const rechargeMoney = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { amount } = req.body;

        // 验证充值金额
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: '充值金额必须是一个大于0的数字' });
        }

        // 执行充值操作
        const newBalance = await UserService.rechargeMoney(userId, amount);
        res.json({ 
            success: true,
            newBalance 
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

/**
 * 获取用户余额
 * @param req 请求对象（包含认证用户信息）
 * @param res 响应对象
 * @response 200 返回当前余额
 * @response 400 请求错误
 */
export const getBalance = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const balance = await UserService.getUserMoney(userId);
        res.json({ balance });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * 更新用户资料
 * @param req 请求对象（包含认证用户信息和可更新的字段）
 * @param res 响应对象
 * @bodyParam username 可选，新用户名
 * @bodyParam address 可选，新地址
 * @response 200 返回更新后的用户信息（不含密码）
 * @response 400 参数错误
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { username, address } = req.body;

        // 验证至少提供一个更新字段
        if (!username && !address) {
            return res.status(400).json({ error: '至少提供一个更新字段' });
        }

        // 执行更新操作
        const updatedUser = await UserService.updateProfile(userId, { username, address });
        
        // 排除密码字段后返回
        const { password, ...userWithoutPassword } = updatedUser;
        res.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 修改用户密码
 * @param req 请求对象（包含认证用户信息和新密码）
 * @param res 响应对象
 * @bodyParam newPassword 新密码
 * @bodyParam confirmPassword 确认密码
 * @response 200 修改成功
 * @response 400 参数错误或密码不一致
 */
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { newPassword, confirmPassword } = req.body;

        // 验证密码输入
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ error: '请提供新密码和确认密码' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: '两次输入的密码不一致' });
        }

        // 执行密码修改
        await UserService.changePassword(userId, newPassword);
        
        res.json({
            success: true,
            message: '密码已修改，请重新登录'
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 设置用户为管理员（管理员操作）
 * @param req 请求对象（包含目标用户ID）
 * @param res 响应对象
 * @pathParam userId 目标用户ID
 * @response 200 返回更新后的用户信息
 * @response 400 操作失败
 */
export const setAdminRole = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const updatedUser = await UserService.setAdminRole(Number(userId));
        
        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};