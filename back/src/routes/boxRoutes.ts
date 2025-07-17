import express from 'express';
import BoxController from '../controllers/boxController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 创建盲盒
router.post('/createbox', authenticate, BoxController.createBox);

// 获取所有盲盒
router.get('/getallboxes', BoxController.getAllBoxes);

// 获取单个盲盒
router.get('/:id', BoxController.getBoxById);

// 上传盲盒图片
router.post('/upload', authenticate, upload.single('image'), BoxController.uploadBoxImage);

router.delete('/:id', authenticate, BoxController.deleteBox);

router.post('/:id/purchase', authenticate, BoxController.purchaseBox);
export default router;