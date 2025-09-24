import Stripe from 'stripe';
import { env } from '../config/env/index.js';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
  
});
console.log("STRIPE KEY:", env.STRIPE_SECRET_KEY); // should print full key

