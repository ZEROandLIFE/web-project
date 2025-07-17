import { Request, Response } from 'express';
import BoxService from '../services/boxService';
import { authenticate } from '../middleware/auth';
import { console } from 'inspector';

class BoxController {
    // 创建盲盒
    async createBox(req: Request, res: Response) {
        try {
            console.log(1);
            const user = (req as any).user; // 从认证中间件获取用户信息
            //调试
            console.log('接收到的请求体:', req.body); 
            console.log('解析后的items:', req.body.items); 
            console.log('认证用户:', user); 
            const boxData = {
                ...req.body,
                userId: user.id,
                items: req.body.items 
            };
            const box = await BoxService.createBox(boxData);
            res.status(201).json(box);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllBoxes(req: Request, res: Response) {
        console.log("?")
        try {
            console.log("Controller: 进入 getAllBoxes");
            const boxes = await BoxService.getAllBoxes();
            console.log("Controller: 获取到的 boxes:", boxes); // 检查这里是否真的是 []
            res.json(boxes);
            console.log("Controller: 响应已发送"); // 检查这里是否执行
        } catch (error: any) {
            console.error("Controller: 捕获到错误:", error); // 检查这里是否执行
            res.status(500).json({ error: error.message });
        }
    }

    // 根据ID获取盲盒
    async getBoxById(req: Request, res: Response) {
        try {
            const box = await BoxService.getBoxById(parseInt(req.params.id));
            res.json(box);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    // 上传盲盒图片
    async uploadBoxImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            
            const result = await BoxService.uploadBoxImage(req.file);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new BoxController();