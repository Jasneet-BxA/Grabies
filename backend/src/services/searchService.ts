// services/searchService.ts
import { supabase } from "../config/supabaseClient.js";
import type { Product } from "../types/index.js";

interface SearchFilters {
  q: string;
  tag?: string;
  rating?: number;
  priceRange?: "lt300" | "300to600";
  sort?: "price_asc" | "price_desc";
}

export const searchProductsService = async (
  filters: SearchFilters
): Promise<Product[]> => {
  let query = supabase
    .from("products")
    .select("*")
    .ilike("name", `%${filters.q}%`);

  if (filters.tag) {
    query = query.eq("tag", filters.tag);
  }

  if (filters.rating !== undefined) {
    query = query.gte("rating", filters.rating);
  }

  if (filters.priceRange === "lt300") {
    query = query.lt("price", 300);
  } else if (filters.priceRange === "300to600") {
    query = query.gte("price", 300).lte("price", 600);
  }

  if (filters.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
};
