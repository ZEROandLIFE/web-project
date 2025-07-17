"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const error_1 = require("./middleware/error");
const boxRoutes_1 = __importDefault(require("./routes/boxRoutes"));
const multer_1 = __importDefault(require("multer"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // 前端地址
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const upload = (0, multer_1.default)();
app.use('/api/auth', authRouter_1.default);
app.use('/api/boxes', boxRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.use(error_1.notFound);
app.use(error_1.errorHandler);
