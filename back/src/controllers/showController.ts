import { Request, Response } from 'express';
import ShowModel from '../models/showModel';
import ImageService from '../services/imageService';

class ShowController {
    // 创建分享
    async createShow(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const { description } = req.body;
            
            let imageUrl = '';
            if (req.file) {
                imageUrl = await ImageService.uploadImage(req);
            }

            const show = await ShowModel.createShow({
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar,
                description,
                imageUrl
            });

            res.status(201).json(show);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }

    // 获取所有分享
    async getAllShows(req: Request, res: Response) {
        try {
            const shows = await ShowModel.getAllShows();
            res.json(shows);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }

    // 创建评论
    async createComment(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const { showId, content } = req.body;

            const comment = await ShowModel.createComment({
                showId,
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar,
                content
            });

            res.status(201).json(comment);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'An unknown error occurred' });
            }
        }
    }

    // 获取评论
    async getComments(req: Request, res: Response) {
        try {
            const comments = await ShowModel.getCommentsByShowId(parseInt(req.params.showId));
            res.json(comments);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
}

export default new ShowController();