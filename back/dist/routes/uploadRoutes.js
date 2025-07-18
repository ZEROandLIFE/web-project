"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/uploadRoutes.ts
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
