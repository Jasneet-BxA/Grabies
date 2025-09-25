import express from 'express';
import { createCheckoutSession, placeOrderCashOnDelivery } from '../controllers/paymentController.js';
import {authenticateToken} from '../middlewares/authMiddleware.js'; 
 
const router = express.Router();
 
router.get('/:addressId',  authenticateToken, createCheckoutSession);
router.post("/cod-order/:addressId", authenticateToken, placeOrderCashOnDelivery);

export default router;