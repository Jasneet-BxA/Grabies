import express from "express";
import { createPaymentIntentController } from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/payment-intent", createPaymentIntentController);

export default router;
