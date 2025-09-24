// routes/stripeWebhook.ts
import express from "express";
import { stripe } from "../utils/stripe.js";
import { confirmOrderPayment } from "../services/orderService.js";
import type Stripe from "stripe";
 
const router = express.Router();
 
// Stripe requires raw body for signature verification
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"]!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
 
  let event;
 
 try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    } else {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send("Webhook Error: Unknown error");
    }
  }
 
  // Handle payment success
  if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session;

  if (session.metadata && session.metadata.orderId) {
    const orderId = session.metadata.orderId;

    try {
      await confirmOrderPayment(orderId);
      console.log(`Order ${orderId} marked as paid`);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error confirming order payment:", err.message);
      } else {
        console.error("Error confirming order payment:", err);
      }
    }
  } else {
    console.warn("No orderId found in session metadata");
  }
}

 
  res.status(200).json({ received: true });
});
 
export default router;