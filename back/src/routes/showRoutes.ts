import express from 'express';
import ShowController from '../controllers/showController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/create', authenticate, upload.single('image'), ShowController.createShow);
router.get('/all', ShowController.getAllShows);
router.post('/comment', authenticate, ShowController.createComment);
router.get('/:showId/comments', ShowController.getComments);

export default router;