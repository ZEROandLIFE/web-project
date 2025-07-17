"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boxModel_1 = __importDefault(require("../models/boxModel"));
// import api from './api';
class BoxService {
    // 创建盲盒
    async createBox(boxData) {
        // 验证盲盒数量不超过物品数量总和
        console.log(1);
        const totalItems = boxData.items.reduce((sum, item) => sum + item.quantity, 0);
        if (boxData.boxNum > totalItems) {
            throw new Error('盲盒的数量不能大于包含物品中所有物品数量总和');
        }
        return boxModel_1.default.createBox(boxData);
    }
    // 获取所有盲盒
    async getAllBoxes() {
        console.log("Service: 进入 getAllBoxes");
        const boxes = await boxModel_1.default.getAllBoxes();
        console.log("Service: 获取到的 boxes:", boxes); // 检查这里是否真的是 []
        return boxes;
        // return BoxModel.getAllBoxes();
    }
    // 根据ID获取盲盒
    async getBoxById(boxId) {
        return boxModel_1.default.getBoxById(boxId);
    }
    // 上传盲盒图片
    async uploadBoxImage(file) {
        // 这里可以添加图片处理逻辑，如压缩、格式转换等
        // 实际项目中可能会上传到云存储服务如AWS S3、阿里云OSS等
        return { url: `/uploads/${file.filename}` };
    }
}
exports.default = new BoxService();
