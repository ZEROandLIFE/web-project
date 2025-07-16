"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const error_1 = require("./middleware/error");
const app = (0, express_1.default)();
app.options('*', (0, cors_1.default)());
app.use('/api/auth', auth_1.default);
app.use(error_1.notFound);
app.use(error_1.errorHandler);
