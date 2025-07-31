"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boxService_1 = __importDefault(require("../services/boxService"));
const inspector_1 = require("inspector");
const imageService_1 = __importDefault(require("../services/imageService"));
/**
 * 盲盒控制器，处理与盲盒相关的请求
 */
class BoxController {
    /**
     * 创建新的盲盒
     * @param req 请求对象，包含盲盒信息和上传的文件
     * @param res 响应对象
     * @requires 用户认证中间件
     */
    async createBox(req, res) {
        try {
            const user = req.user;
            // 从请求体中提取盲盒数据
            const { boxName, boxDescription, boxNum, price, items } = req.body;
            // 解析物品列表JSON字符串
            let parsedItems = [];
            try {
                parsedItems = JSON.parse(items);
            }
            catch (err) {
                inspector_1.console.error('解析 items 失败:', err);
                return res.status(400).json({ error: '物品列表格式不正确' });
            }
            // 处理上传的盲盒图片
            let avatarUrl = 'default-avatar.png';
            if (req.file) {
                avatarUrl = await imageService_1.default.uploadImage(req);
                inspector_1.console.log(avatarUrl);
            }
            // 构造盲盒数据对象
            const boxData = {
                boxName,
                boxDescription,
                boxNum: Number(boxNum),
                price: Number(price),
                userId: user.id,
                items: parsedItems,
                boxAvatar: avatarUrl
            };
            // 调用服务层创建盲盒
            const box = await boxService_1.default.createBox(boxData);
            res.status(201).json(box);
        }
        catch (error) {
            inspector_1.console.error('创建盲盒错误:', error);
            res.status(400).json({ error: error.message });
        }
    }
    /**
     * 获取所有盲盒列表
     * @param req 请求对象
     * @param res 响应对象
     */
    async getAllBoxes(req, res) {
        try {
            const boxes = await boxService_1.default.getAllBoxes();
            res.json(boxes);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /**
     * 根据ID获取单个盲盒详情
     * @param req 请求对象，包含盲盒ID参数
     * @param res 响应对象
     */
    async getBoxById(req, res) {
        try {
            const box = await boxService_1.default.getBoxById(parseInt(req.params.id));
            res.json(box);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    /**
     * 删除指定ID的盲盒
     * @param req 请求对象，包含盲盒ID参数
     * @param res 响应对象
     * @requires 用户认证中间件
     */
    async deleteBox(req, res) {
        try {
            const user = req.user;
            const boxId = parseInt(req.params.id);
            // 验证用户权限
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
    /**
     * 购买盲盒
     * @param req 请求对象，包含盲盒ID参数
     * @param res 响应对象
     * @requires 用户认证中间件
     */
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
