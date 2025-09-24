import { getUserOrdersService } from "../services/orderService.js";
import type { Request, Response } from "express";
import {
  createOrderFromCartService,
  getOrderAmount,
  confirmOrderPayment,
} from "../services/orderService.js";
import { stripe } from "../utils/stripe.js";

export const createOrderFromCart = async (req: Request, res: Response) => {
  const { addressId } = req.body;
  const result = await createOrderFromCartService(req.user!.id, addressId);
  res.json(result);
};

export const confirmPayment = async (req: Request, res: Response) => {
  const { orderId } = req.body;
  await confirmOrderPayment(orderId);
  res.json({ message: "Payment confirmed" });
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await getUserOrdersService(req.user!.id);
  res.json(orders);
};
