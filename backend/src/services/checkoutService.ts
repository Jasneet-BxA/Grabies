import { stripe } from "../utils/stripe.js";
import { getOrderAmount } from "./orderService.js";

export const createStripePaymentIntent = async (orderId: string) => {
  const amount = await getOrderAmount(orderId); // E.g. 598.00

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe uses smallest currency unit (paise)
    currency: "inr",
    metadata: {
      order_id: orderId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};
