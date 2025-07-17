"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boxService_1 = __importDefault(require("../services/boxService"));
const inspector_1 = require("inspector");
class BoxController {
    // 创建盲盒
    async createBox(req, res) {
        try {
            inspector_1.console.log(1);
            const user = req.user; // 从认证中间件获取用户信息
            //调试
            inspector_1.console.log('接收到的请求体:', req.body);
            inspector_1.console.log('解析后的items:', req.body.items);
            inspector_1.console.log('认证用户:', user);
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
        inspector_1.console.log("?");
        try {
            inspector_1.console.log("Controller: 进入 getAllBoxes");
            const boxes = await boxService_1.default.getAllBoxes();
            inspector_1.console.log("Controller: 获取到的 boxes:", boxes); // 检查这里是否真的是 []
            res.json(boxes);
            inspector_1.console.log("Controller: 响应已发送"); // 检查这里是否执行
        }
        catch (error) {
            inspector_1.console.error("Controller: 捕获到错误:", error); // 检查这里是否执行
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
}
exports.default = new BoxController();
