import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import authRouter  from './routes/authRoute.js';
import addressRouter from './routes/addressRoute.js'
import menuRouter from './routes/menuRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import { errorHandler } from 'middlewares/errorHandler.js';
 
const app = express();
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(express.json());
app.use(cookieParser());
 
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/address', addressRouter);
app.use('/menu', menuRouter);
app.use('/wishlist', wishlistRouter);
 
app.use(errorHandler);
 
export default app;