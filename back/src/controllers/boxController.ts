import { Request, Response } from 'express';
import BoxService from '../services/boxService';
import { authenticate } from '../middleware/auth';
import { console } from 'inspector';
import ImageService from '../services/imageService';
class BoxController {
    // 创建盲盒
    async createBox(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        
        // 从 FormData 中获取数据
        const { boxName, boxDescription, boxNum, price, items } = req.body;
        console.log(0)
        // 处理 JSON 字符串
        let parsedItems = [];
        try {
            parsedItems = JSON.parse(items);
        } catch (err) {
            console.error('解析 items 失败:', err);
            return res.status(400).json({ error: '物品列表格式不正确' });
        }
console.log(1)
        // 上传图片并获取 URL
        let boxAvatar: string | undefined = undefined; // 明确类型
        const avatar = req.file;
        let avatarUrl = 'default-avatar.png';
        if (avatar) {
            if (avatar) {
                avatarUrl = await ImageService.uploadImage(req);
                console.log(avatarUrl);
            }
        }
console.log(2)
        const boxData = {
            boxName,
            boxDescription,
            boxNum: Number(boxNum),
            price: Number(price),
            userId: user.id,
            items: parsedItems,
            boxAvatar :avatar ?  avatarUrl : undefined
        };
console.log(3)
        const box = await BoxService.createBox(boxData);
        res.status(201).json(box);
    } catch (error: any) {
        console.error('创建盲盒错误:', error);
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