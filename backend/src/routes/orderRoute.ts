import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { authenticateToken } from "middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateToken);
router.get("/", orderController.getOrders);
router.post("/create-order", orderController.createOrderFromCart);
router.post("/create-payment-intent", orderController.createPaymentIntent);
router.post("/confirm-payment", orderController.confirmPayment);

export default router;
