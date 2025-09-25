import { getOrderByIdService, getUserOrdersService } from "../services/orderService.js";
import type { NextFunction, Request, Response } from "express";
import {
  createOrderFromCartService,
  confirmOrderPayment,
} from "../services/orderService.js";

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;

  try {
    const order = await getOrderByIdService(orderId as string);
    console.log(order);
    return res.status(200).json(order); 
  } catch (error) {
    console.error("Error in getOrderByIdController:", error);
    next(error)
  }
};
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
