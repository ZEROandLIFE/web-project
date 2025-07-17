"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boxService_1 = __importDefault(require("../services/boxService"));
class BoxController {
    // 创建盲盒
    async createBox(req, res) {
        try {
            const user = req.user; // 从认证中间件获取用户信息
            //调试
            const boxData = {
                ...req.body,
                userId: user.id,
                items: req.body.items
            };
            const box = await boxService_1.default.createBox(boxData);
            res.status(201).json(box);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getAllBoxes(req, res) {
        try {
            const boxes = await boxService_1.default.getAllBoxes();
            res.json(boxes);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // 根据ID获取盲盒
    async getBoxById(req, res) {
        try {
            const box = await boxService_1.default.getBoxById(parseInt(req.params.id));
            res.json(box);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    // 上传盲盒图片
    async uploadBoxImage(req, res) {
        try {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            const result = await boxService_1.default.uploadBoxImage(req.file);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // 删除盲盒
    async deleteBox(req, res) {
        try {
            const user = req.user;
            const boxId = parseInt(req.params.id);
            // 验证用户是否有权限操作这个盲盒
            const box = await boxService_1.default.getBoxById(boxId);
            if (box.userId !== user.id) {
                return res.status(403).json({ error: '无权操作此盲盒' });
            }
            await boxService_1.default.deleteBox(boxId);
            res.json({ message: '盲盒已删除' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async purchaseBox(req, res) {
        try {
            const user = req.user;
            const boxId = parseInt(req.params.id);
            const result = await boxService_1.default.purchaseBox(boxId, user.id);
            res.json({
                success: true,
                item: result.item,
                remaining: result.remaining,
                message: `恭喜获得: ${result.item.name}`
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
}
exports.default = new BoxController();
