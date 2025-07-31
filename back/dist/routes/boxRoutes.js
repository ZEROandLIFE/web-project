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
const upload = (0, multer_1.default)(); // 用于处理文件上传的multer实例
/**
 * 盲盒管理路由
 */
/**
 * 创建新的盲盒
 * @route POST /createbox
 * @requires auth 中间件验证
 * @consumes multipart/form-data
 * @param {file} boxAvatar - 盲盒封面图片（可选）
 */
router.post('/createbox', auth_1.authenticate, upload.single('boxAvatar'), boxController_1.default.createBox);
/**
 * 获取所有盲盒列表
 * @route GET /getallboxes
 */
router.get('/getallboxes', boxController_1.default.getAllBoxes);
/**
 * 根据ID获取单个盲盒详情
 * @route GET /:id
 * @param {string} id - 盲盒的唯一ID
 */
router.get('/:id', boxController_1.default.getBoxById);
/**
 * 删除指定ID的盲盒
 * @route DELETE /:id
 * @requires auth 中间件验证
 * @param {string} id - 要删除的盲盒ID
 */
router.delete('/:id', auth_1.authenticate, boxController_1.default.deleteBox);
/**
 * 购买指定ID的盲盒
 * @route POST /:id/purchase
 * @requires auth 中间件验证
 * @param {string} id - 要购买的盲盒ID
 */
router.post('/:id/purchase', auth_1.authenticate, boxController_1.default.purchaseBox);
exports.default = router;
