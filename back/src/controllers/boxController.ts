import { Request, Response } from 'express';
import BoxService from '../services/boxService';
import { authenticate } from '../middleware/auth';
import { console } from 'inspector';

class BoxController {
    // 创建盲盒
    async createBox(req: Request, res: Response) {
        try {
            const user = (req as any).user; // 从认证中间件获取用户信息
            //调试
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
        try {
            const boxes = await BoxService.getAllBoxes();
            res.json(boxes);
        } catch (error: any) {
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
        // 删除盲盒
    async deleteBox(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const boxId = parseInt(req.params.id);
            
            // 验证用户是否有权限操作这个盲盒
            const box = await BoxService.getBoxById(boxId);
            if (box.userId !== user.id) {
                return res.status(403).json({ error: '无权操作此盲盒' });
            }
            
            await BoxService.deleteBox(boxId);
            res.json({ message: '盲盒已删除' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
    async purchaseBox(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        const boxId = parseInt(req.params.id);
        
        const result = await BoxService.purchaseBox(boxId, user.id);
        
        res.json({
            success: true,
            item: result.item,
            remaining: result.remaining,
            message: `恭喜获得: ${result.item.name}`
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
}
}

export default new BoxController();