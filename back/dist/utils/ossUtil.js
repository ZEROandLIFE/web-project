"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ossUtil = void 0;
// utils/ossUtil.ts
const ali_oss_1 = __importDefault(require("ali-oss"));
class OssUtil {
    client;
    config;
    constructor(config) {
        this.config = config;
        this.client = new ali_oss_1.default({
            endpoint: config.endpoint,
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            bucket: config.bucketName,
        });
    }
    async upload(fileName, buffer) {
        try {
            const result = await this.client.put(fileName, buffer);
            // 返回公开可访问的URL（不需要签名）
            return result.url.split('?')[0];
        }
        catch (error) {
            throw new Error(`文件上传失败: ${error.message}`);
        }
    }
}
// 从环境变量或配置文件中读取配置
const ossConfig = {
    endpoint: process.env.OSS_ENDPOINT || 'oss-cn-shanghai.aliyuncs.com',
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || 'LTAI5t8QCh7pX7fe834kRqkX',
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || 'V93UZ5e9AANLXeKkVV50NUMGGD6qTv',
    bucketName: process.env.OSS_BUCKET_NAME || 'web-2025project'
};
exports.ossUtil = new OssUtil(ossConfig);
