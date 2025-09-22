import { supabase } from "config/supabaseClient.js";
import type { FilterOptions, Product } from "types/index.js";
 
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
 
  if (filters.tag) query = query.eq("tag", filters.tag);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.rating !== undefined) query = query.gte("rating", filters.rating);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);
  if (filters.sort) {
    const [column, direction] = filters.sort.split("_");
 
    const validColumns = ["price", "rating", "name"];
    const validDirections = ["asc", "desc"];
 
    if (column && direction && validColumns.includes(column) && validDirections.includes(direction)) {
      query = query.order(column, { ascending: direction === "asc" });
    }
  }
 
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
 
  return {
    data: data || [],
    total: count || 0,
  };
};