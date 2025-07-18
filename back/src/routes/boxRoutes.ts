import express from 'express';
import BoxController from '../controllers/boxController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer(); 
// 创建盲盒
router.post('/createbox', authenticate, upload.single('boxAvatar'), BoxController.createBox);

// 获取所有盲盒
router.get('/getallboxes', BoxController.getAllBoxes);

// 获取单个盲盒
router.get('/:id', BoxController.getBoxById);


router.delete('/:id', authenticate, BoxController.deleteBox);

router.post('/:id/purchase', authenticate, BoxController.purchaseBox);
export default router;