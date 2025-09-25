import { stripe } from "../utils/stripe.js";
import { getOrderAmount } from "./orderService.js";

export const createStripePaymentIntent = async (orderId: string) => {
  const amount = await getOrderAmount(orderId);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "inr",
    metadata: {
      order_id: orderId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};
