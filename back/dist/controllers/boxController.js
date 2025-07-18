"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boxService_1 = __importDefault(require("../services/boxService"));
const inspector_1 = require("inspector");
const imageService_1 = __importDefault(require("../services/imageService"));
class BoxController {
    // 创建盲盒
    async createBox(req, res) {
        try {
            const user = req.user;
            // 从 FormData 中获取数据
            const { boxName, boxDescription, boxNum, price, items } = req.body;
            inspector_1.console.log(0);
            // 处理 JSON 字符串
            let parsedItems = [];
            try {
                parsedItems = JSON.parse(items);
            }
            catch (err) {
                inspector_1.console.error('解析 items 失败:', err);
                return res.status(400).json({ error: '物品列表格式不正确' });
            }
            inspector_1.console.log(1);
            // 上传图片并获取 URL
            let boxAvatar = undefined; // 明确类型
            const avatar = req.file;
            let avatarUrl = 'default-avatar.png';
            if (avatar) {
                if (avatar) {
                    avatarUrl = await imageService_1.default.uploadImage(req);
                    inspector_1.console.log(avatarUrl);
                }
            }
            inspector_1.console.log(2);
            const boxData = {
                boxName,
                boxDescription,
                boxNum: Number(boxNum),
                price: Number(price),
                userId: user.id,
                items: parsedItems,
                boxAvatar: avatar ? avatarUrl : undefined
            };
            inspector_1.console.log(3);
            const box = await boxService_1.default.createBox(boxData);
            res.status(201).json(box);
        }
        catch (error) {
            inspector_1.console.error('创建盲盒错误:', error);
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
