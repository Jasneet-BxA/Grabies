import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { authenticateToken } from "middlewares/authMiddleware.js";

const router = Router();
 
router.use(authenticateToken);
router.get("/", orderController.getOrders);
router.get("/:orderId", orderController.getOrderById);
router.post("/create-order", orderController.createOrderFromCart);
router.post("/confirm-payment", orderController.confirmPayment);

export default router;

