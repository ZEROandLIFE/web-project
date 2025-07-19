"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const showModel_1 = __importDefault(require("../models/showModel"));
const imageService_1 = __importDefault(require("../services/imageService"));
class ShowController {
    // 创建分享
    async createShow(req, res) {
        try {
            const user = req.user;
            const { description } = req.body;
            let imageUrl = '';
            if (req.file) {
                imageUrl = await imageService_1.default.uploadImage(req);
            }
            const show = await showModel_1.default.createShow({
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar,
                description,
                imageUrl
            });
            res.status(201).json(show);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
    // 获取所有分享
    async getAllShows(req, res) {
        try {
            const shows = await showModel_1.default.getAllShows();
            res.json(shows);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    // 创建评论
    async createComment(req, res) {
        try {
            const user = req.user;
            const { showId, content } = req.body;
            const comment = await showModel_1.default.createComment({
                showId,
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar,
                content
            });
            res.status(201).json(comment);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }
    // 获取评论
    async getComments(req, res) {
        try {
            const comments = await showModel_1.default.getCommentsByShowId(parseInt(req.params.showId));
            res.json(comments);
        }
        catch (error) {
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
