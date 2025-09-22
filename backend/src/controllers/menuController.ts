import type { Request, Response, NextFunction } from "express";
import { getFilteredProductsService, getProductsByCategoryService} from "../services/menuService.js";
import type { FilterOptions } from "../types/index.js";
 
export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.params.category as string;
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
 
    const products = await getProductsByCategoryService(category);
    res.json(products);
  } catch (error) {
    next(error);
  }
};
 
export const getFilteredMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = req.params.category as string;
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    const { tag, minPrice, maxPrice, rating, search, sort} = req.query;
 
    const filters: FilterOptions = {
      category,
      ...(tag ? { tag: tag as string } : {}),
      ...(minPrice ? { minPrice: Number(minPrice) } : {}),
      ...(maxPrice ? { maxPrice: Number(maxPrice) } : {}),
      ...(rating ? { rating: Number(rating) } : {}),
      ...(search ? { search: search as string } : {}),
      ...(sort ? { sort: sort as string } : {}),
    };
 
    const filteredProducts = await getFilteredProductsService(filters);
    res.json(filteredProducts);
  } catch (error) {
    next(error);
  }
};