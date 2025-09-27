import { stripe } from "../utils/stripe.js";
import type { Request, Response } from "express";
import { createOrderFromCartService } from "../services/orderService.js";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const addressId = req.params.addressId;
    if (!addressId) {
      return res.status(400).json({ error: "Address ID is required" });
    }

    const { orderId, totalPrice } = await createOrderFromCartService(userId, addressId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], 
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Food Order" },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: { orderId, userId },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const placeOrderCashOnDelivery = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const addressId = req.params.addressId;
    if (!addressId) {
      return res.status(400).json({ error: "Address ID is required" });
    }

    const { orderId, totalPrice } = await createOrderFromCartService(userId, addressId);

    res.json({ message: "Order placed with Cash on Delivery", orderId });
  } catch (error) {
    console.error("Error placing COD order:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
