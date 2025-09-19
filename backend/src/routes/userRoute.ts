import { Router } from 'express';
import { supabase } from '../config/supabaseClient.js';

export const userRouter = Router();

userRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  console.log(data, error);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});