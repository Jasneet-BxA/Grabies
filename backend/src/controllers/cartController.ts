import type { Request, Response } from "express";
import { supabase } from "../config/supabaseClient.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { addToCartSchema } from "utils/zodValidators.js";
import { any } from "zod";

export class cartController {
  static async getCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { data, error } = await supabase
        .from("cart")
        .select("*, products(*)")
        .eq("user_id", userId);
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  static async addToCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { product_id, quantity } = addToCartSchema.parse(req.body);
      const { data: existing, error: fetchErr } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", product_id)
        .single();
      if (fetchErr && fetchErr.code !== "PGRST116") throw fetchErr; 
      if (existing) {
        const { data, error } = await supabase
          .from("cart")
          .update({ quantity })
          .eq("id", existing.id)
          .single();
        if (error) throw error;
        return res.json(data);
      } else {
        const { data, error } = await supabase
          .from("cart")
          .insert({
            user_id: userId,
            product_id,
            quantity,
          })
          .select()
          .single();
        if (error) throw error;
        return res.json(data);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  static async removeCartItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { cartId } = req.params;
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cartId)
        .eq("user_id", userId);
      if (error) throw error;
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
