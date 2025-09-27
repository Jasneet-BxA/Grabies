import { supabase } from "../config/supabaseClient.js";
import type { Product, SearchFilters } from "../types/index.js";

export const searchProductsService = async (
  filters: SearchFilters
): Promise<Product[]> => {
  let query = supabase
    .from("products")
    .select("*")
    .ilike("name", `%${filters.q}%`);

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
};
