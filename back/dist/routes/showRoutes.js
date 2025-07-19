"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const showController_1 = __importDefault(require("../controllers/showController"));
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.post('/create', auth_1.authenticate, upload.single('image'), showController_1.default.createShow);
router.get('/all', showController_1.default.getAllShows);
router.post('/comment', auth_1.authenticate, showController_1.default.createComment);
router.get('/:showId/comments', showController_1.default.getComments);
exports.default = router;
