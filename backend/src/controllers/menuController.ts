import type { Request, Response, NextFunction } from "express";
import { getFilteredProductsService, getProductsByCategoryService , getProductByNameService , getAllProductsService} from "../services/menuService.js";
import type { FilterOptions } from "../types/index.js";


export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
 
    const products = await getAllProductsService(limit, offset);
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

    const {
      tag,
      rating,
      priceRange,
    } = req.query;

    const filters: FilterOptions = {
      category,
      ...(tag ? { tag: tag as string } : {}),
      ...(priceRange ? { priceRange: priceRange as "lt300" | "300to600" } : {}),
      ...(rating ? { rating: Number(rating) } : {}),
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