import { supabase } from "../config/supabaseClient.js";
import type { Product } from "../types/index.js";
 
export const getWishlistService = async (userId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("wishlist")
    .select("product:product_id(*)")
    .eq("user_id", userId);
 
  if (error) throw new Error(error.message);
 
  return (
    data
      ?.map(item => {
        const product = Array.isArray(item.product)
          ? item.product[0]
          : item.product;
 
        return product as Product;
      })
      .filter(Boolean) ?? []
  );
};
 
 
export const addToWishlistService = async (userId: string, productId: string) => {
  const { error } = await supabase
    .from("wishlist")
    .insert({ user_id: userId, product_id: productId });
 
  if (error && !error.message.includes("duplicate key")) {
    throw new Error(error.message);
  }
};
 
export const removeFromWishlistService = async (userId: string, productId: string) => {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
 
  if (error) throw new Error(error.message);
};