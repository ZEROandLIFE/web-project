// routes/uploadRoutes.ts
import express from 'express';
import imageService from '../services/imageService';
import { Request, Response } from 'express';

const router = express.Router();

// router.post('/', imageService.getUploadMiddleware(), async (req: Request, res: Response) => {
//   try {
//     const imageUrl = await imageService.uploadImage(req);
//     res.json({
//       success: true,
//       url: imageUrl
//     });
//   } catch (error:any) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

export default router;