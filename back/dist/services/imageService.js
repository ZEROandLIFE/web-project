"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/imageService.ts
const ossUtil_1 = require("../utils/ossUtil");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
/**
 * 图片处理服务
 * @class ImageService
 * @description 提供图片上传相关的中间件和业务逻辑处理
 */
class ImageService {
    /**
     * Multer实例配置
     * @private
     * @property {multer.Multer} upload - 配置内存存储和文件过滤的multer实例
     */
    upload = (0, multer_1.default)({
        storage: multer_1.default.memoryStorage(), // 使用内存存储处理文件
        limits: {
            fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
        },
        fileFilter: (req, file, cb) => {
            // 只允许图片类型的文件上传
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new Error('只允许上传图片文件'));
            }
        }
    });
    /**
     * 获取图片上传中间件
     * @public
     * @returns {multer.Instance} 配置好的multer单文件上传中间件
     * @description 用于Express路由中处理文件上传
     */
    getUploadMiddleware() {
        return this.upload.single('image');
    }
    /**
     * 上传图片到OSS存储
     * @public
     * @param {Request} req - Express请求对象，需包含上传的文件
     * @returns {Promise<string>} 返回图片的访问URL
     * @throws {Error} 当没有上传文件或上传失败时抛出错误
     */
    async uploadImage(req) {
        // 验证文件是否存在
        if (!req.file) {
            throw new Error('没有上传文件');
        }
        // 生成唯一文件名并保留原始扩展名
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `uploads/${(0, uuid_1.v4)()}.${fileExtension}`;
        // 上传到OSS并返回访问URL
        return await ossUtil_1.ossUtil.upload(fileName, req.file.buffer);
    }
}
exports.default = new ImageService();
