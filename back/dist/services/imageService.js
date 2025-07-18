"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/imageService.ts
const ossUtil_1 = require("../utils/ossUtil");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
class ImageService {
    upload = (0, multer_1.default)({
        storage: multer_1.default.memoryStorage(), // 使用内存存储
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB限制
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new Error('只允许上传图片文件'));
            }
        }
    });
    getUploadMiddleware() {
        return this.upload.single('image');
    }
    async uploadImage(req) {
        if (!req.file) {
            throw new Error('没有上传文件');
        }
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `uploads/${(0, uuid_1.v4)()}.${fileExtension}`;
        return await ossUtil_1.ossUtil.upload(fileName, req.file.buffer);
    }
}
exports.default = new ImageService();
