"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const boxController_1 = __importDefault(require("../controllers/boxController"));
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// 创建盲盒
router.post('/createbox', auth_1.authenticate, boxController_1.default.createBox);
// 获取所有盲盒
router.get('/getallboxes', boxController_1.default.getAllBoxes);
// 获取单个盲盒
router.get('/:id', boxController_1.default.getBoxById);
// 上传盲盒图片
router.post('/upload', auth_1.authenticate, upload.single('image'), boxController_1.default.uploadBoxImage);
exports.default = router;
