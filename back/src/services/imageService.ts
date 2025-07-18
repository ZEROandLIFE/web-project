// services/imageService.ts
import { ossUtil } from '../utils/ossUtil';
import { Request } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

class ImageService {
  private upload = multer({
    storage: multer.memoryStorage(), // 使用内存存储
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB限制
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('只允许上传图片文件'));
      }
    }
  });

  public getUploadMiddleware() {
    return this.upload.single('image');
  }

  public async uploadImage(req: Request): Promise<string> {
    if (!req.file) {
      throw new Error('没有上传文件');
    }

    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `uploads/${uuidv4()}.${fileExtension}`;
    
    return await ossUtil.upload(fileName, req.file.buffer);
  }
}

export default new ImageService();