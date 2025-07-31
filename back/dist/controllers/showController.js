"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const showModel_1 = __importDefault(require("../models/showModel"));
const imageService_1 = __importDefault(require("../services/imageService"));
/**
 * 分享内容控制器
 * 处理分享内容的创建、获取以及相关评论操作
 */
class ShowController {
    /**
     * 创建新的分享内容
     * @param req 请求对象，包含用户认证信息和分享内容数据
     * @param res 响应对象
     * @bodyParam description 分享描述文本
     * @file image 可选的图片文件
     * @header Authorization 用户认证token
     * @response 201 创建成功，返回分享内容详情
     * @response 400 请求参数错误
     */
    async createShow(req, res) {
        try {
            // 从请求中获取用户信息和描述内容
            const user = req.user;
            const { description } = req.body;
            // 处理图片上传（如果存在）
            let imageUrl = '';
            if (req.file) {
                imageUrl = await imageService_1.default.uploadImage(req);
            }
            // 创建分享内容
            const show = await showModel_1.default.createShow({
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar,
                description,
                imageUrl
            });
            // 返回创建成功的分享内容
            res.status(201).json(show);
        }
        catch (error) {
            // 统一错误处理
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
    /**
     * 获取所有分享内容
     * @param req 请求对象
     * @param res 响应对象
     * @response 200 返回分享内容列表
     * @response 500 服务器内部错误
     */
    async getAllShows(req, res) {
        try {
            // 获取所有分享内容
            const shows = await showModel_1.default.getAllShows();
            res.json(shows);
        }
        catch (error) {
            // 统一错误处理
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    /**
     * 创建评论
     * @param req 请求对象，包含用户认证信息和评论内容
     * @param res 响应对象
     * @bodyParam showId 被评论的分享内容ID
     * @bodyParam content 评论内容
     * @header Authorization 用户认证token
     * @response 201 创建成功，返回评论详情
     * @response 400 请求参数错误
     */
    async createComment(req, res) {
        try {
            // 从请求中获取用户信息和评论内容
            const user = req.user;
            const { showId, content } = req.body;
            // 创建评论
            const comment = await showModel_1.default.createComment({
                showId,
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar,
                content
            });
            // 返回创建成功的评论
            res.status(201).json(comment);
        }
        catch (error) {
            // 统一错误处理
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
    /**
     * 获取指定分享内容的所有评论
     * @param req 请求对象，包含分享内容ID
     * @param res 响应对象
     * @pathParam showId 分享内容ID
     * @response 200 返回评论列表
     * @response 500 服务器内部错误
     */
    async getComments(req, res) {
        try {
            // 获取指定分享内容的所有评论
            const comments = await showModel_1.default.getCommentsByShowId(parseInt(req.params.showId));
            res.json(comments);
        }
        catch (error) {
            // 统一错误处理
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
}
exports.default = new ShowController();
