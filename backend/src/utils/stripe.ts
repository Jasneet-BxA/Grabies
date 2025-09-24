import Stripe from 'stripe';
import { env } from '../config/env/index.js';
export const stripe = new Stripe(env.STRIPE_SECRET_KEY);
