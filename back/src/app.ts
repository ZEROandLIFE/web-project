import express from 'express';
import cors from 'cors';
import authRouter from './routes/router';
import { notFound, errorHandler } from './middleware/error';

const app = express();

app.options('*', cors());
app.use('/api/auth', authRouter);
app.use(notFound);
app.use(errorHandler);

