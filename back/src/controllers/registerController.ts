import { Request, Response } from 'express';
import RegisterService from '../services/registerService';
import { UserInput } from '../types/register';
import ImageService from '../services/imageService';
class RegisterController {

    async register(req: Request, res: Response)  {
  try {
    const { username, password, phone, address } = req.body;
    const avatar = req.file; // 获取上传的文件
    let avatarUrl = 'default-avatar.png';
            if (avatar) {
                avatarUrl = await ImageService.uploadImage(req); // 使用 ImageService 上传图片
            }
  
    const newUser = await RegisterService.register({
      username,
      password,
      phone,
      address,
      avatar: avatar ?  avatarUrl : undefined
    });
    // 返回
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
  }
  catch (error:any) {
  
    console.error('注册错误:', error);
    // 根据错误类型返回不同的状态码
    if (error.message === 'Username already exists') {
      res.status(409).json({ error: '用户名已存在' });
    } else if (error.message === 'Phone number already exists') {
      res.status(409).json({ error: '手机号已注册' });
    } else {
      res.status(500).json({ error: '注册失败' });
    }
    res.status(500).json({ error: '注册失败' });
  }

    }
    
}

export default new RegisterController();