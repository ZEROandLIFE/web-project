import BoxModel from '../models/boxModel';
import { Box, BoxInput } from '../types/box';
// import api from './api';

class BoxService {
    // 创建盲盒
    async createBox(boxData: Omit<BoxInput, 'boxId'>): Promise<Box> {
        // 验证盲盒数量不超过物品数量总和
        console.log(1);
        const totalItems = boxData.items.reduce((sum, item) => sum + item.quantity, 0);
        if (boxData.boxNum > totalItems) {
            throw new Error('盲盒的数量不能大于包含物品中所有物品数量总和');
        }
        return BoxModel.createBox(boxData);
    }

    // 获取所有盲盒
    async getAllBoxes(): Promise<Box[]> {
        console.log("Service: 进入 getAllBoxes");
        const boxes = await BoxModel.getAllBoxes();
        console.log("Service: 获取到的 boxes:", boxes); // 检查这里是否真的是 []
        return boxes;
        // return BoxModel.getAllBoxes();
    }

    // 根据ID获取盲盒
    async getBoxById(boxId: number): Promise<Box> {
        return BoxModel.getBoxById(boxId);
    }

    // 上传盲盒图片
    async uploadBoxImage(file: Express.Multer.File): Promise<{ url: string }> {
        // 这里可以添加图片处理逻辑，如压缩、格式转换等
        // 实际项目中可能会上传到云存储服务如AWS S3、阿里云OSS等
        return { url: `/uploads/${file.filename}` };
    }
}

export default new BoxService();