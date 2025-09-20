import { supabase } from "../config/supabaseClient.js";
import type { AddToCartInput } from "../types/index.js";

export const getCartService = async (userId: string) => {
  const { data, error } = await supabase
    .from("cart")
    .select("*, products(*)")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return data;
};

export const addToCartService = async (
  userId: string,
  input: AddToCartInput
) => {
  const { product_id, quantity } = input;

  const { data: existing, error: fetchErr } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", product_id)
    .single();

  if (fetchErr && fetchErr.code !== "PGRST116") {
    throw new Error(fetchErr.message);
  }

  if (existing) {
    const { data, error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("id", existing.id)
      .single();

    if (error) throw new Error(error.message);
    return data;
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

    if (error) throw new Error(error.message);
    return data;
  }
};

export const removeCartItemService = async (userId: string, cartId: string) => {
  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("id", cartId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return { message: "Item removed from cart" };
};
