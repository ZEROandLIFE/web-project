import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';
import { notFound, errorHandler } from './middleware/error';
import boxRoutes from './routes/boxRoutes';
import uploadRoutes from './routes/uploadRoutes';
import multer from 'multer';
import 'dotenv/config'; 
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // 前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer();

app.use('/api/auth', authRouter);
app.use('/api/boxes', boxRoutes);
app.use('/api/upload', uploadRoutes);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
app.use(notFound);
app.use(errorHandler);

