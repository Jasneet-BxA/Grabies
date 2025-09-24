import express from 'express';
import { createCheckoutSession, placeOrderCashOnDelivery } from '../controllers/paymentController.js';
import {authenticateToken} from '../middlewares/authMiddleware.js'; // if you want auth
 
const router = express.Router();
 
// This is the endpoint frontend will call to create the Stripe session
router.get('/:addressId',  authenticateToken, createCheckoutSession);
router.post("/cod-order/:addressId", authenticateToken, placeOrderCashOnDelivery);

 
export default router;