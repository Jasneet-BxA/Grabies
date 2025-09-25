import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import authRouter  from './routes/authRoute.js';
import addressRouter from './routes/addressRoute.js'
import menuRouter from './routes/menuRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import orderRouter from './routes/orderRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import { errorHandler } from './middlewares/errorHandler.js';
import stripeWebhookRouter from './routes/stripeWebhook.js';
import dotenv from 'dotenv';

dotenv.config();
 
const app = express();
app.use('/webhook', stripeWebhookRouter);
console.log(process.env.FRONTEND_URL)
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());
 
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/address', addressRouter);
app.use('/menu', menuRouter);
app.use('/wishlist', wishlistRouter);
app.use('/order', orderRouter);
app.use('/payment', paymentRouter)

 
app.use(errorHandler);
 
export default app;