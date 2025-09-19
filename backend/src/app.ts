import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import authRouter  from './routes/authRoute.js';

const app = express();
app.use(cors({ credentials: true}));

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.get('/', (_req, res) => res.send('Hello Backend is running'));


export default app;