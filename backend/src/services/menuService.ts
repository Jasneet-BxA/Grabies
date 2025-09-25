import { supabase } from "../config/supabaseClient.js";
import type { FilterOptions, Product } from "../types/index.js";
 
export const getAllProductsService = async (
  limit: number = 10,
  offset: number = 0
) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return data as Product[] || [];
};
export const getProductsByCategoryService = async (
  category: string
): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("cuisine", category);
  if (error) throw new Error(error.message);
  return data || [];
};
export const getFilteredProductsService = async (
  filters: FilterOptions
): Promise<{ data: Product[]; total: number }> => {
  let query = supabase.from("products").select("*", { count: "exact" });
  query = query.eq("cuisine", filters.category);
  console.log(filters.tag, filters.priceRange, filters.rating)
  if (filters.tag) query = query.eq("tag", filters.tag);
  if (filters.priceRange === "lt300") {
    query = query.lt("price", 300);
    console.log(query)
  } else if (filters.priceRange === "300to600") {
    query = query.gte("price", 300).lte("price", 600);
  }
  if (filters.rating !== undefined) query = query.gte("rating", filters.rating);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return {
    data: data || [],
    total: count || 0,
  };
};
export const getProductByNameService = async (
  category: string,
  name: string
): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("cuisine", category)
    .ilike("name", decodeURIComponent(name))
    .limit(1);
  if (error) throw new Error(error.message);
  return data?.[0] || null;
};