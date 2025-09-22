import type { Request, Response, NextFunction } from "express";
import { getFilteredProductsService, getProductsByCategoryService , getProductByNameService , getAllProductsService} from "../services/menuService.js";
import type { FilterOptions } from "../types/index.js";


 export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getAllProductsService();
    res.json(products);
  } catch (error) {
    next(error);
  }
};
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
export const getProductByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.params.category;
    const productName = req.params.productName;
 
    if (!category || !productName) {
      return res.status(400).json({ error: "Category and product name are required" });
    }
 
    const product = await getProductByNameService(category, productName);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
 
    res.json(product);
  } catch (error) {
    next(error);
  }
};