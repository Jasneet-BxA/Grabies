import type { Request, Response } from "express";
import { createStripePaymentIntent } from "../services/checkoutService.js";

export const createPaymentIntentController = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId" });
  }

  try {
    const { clientSecret } = await createStripePaymentIntent(orderId);
    res.status(200).json({ clientSecret });
  } catch (error: any) {
    console.error("Stripe Payment Intent Error:", error.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};
