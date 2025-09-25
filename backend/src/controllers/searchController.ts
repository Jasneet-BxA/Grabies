// controllers/searchController.ts
import type { Request, Response, NextFunction } from "express";
import { searchProductsService } from "../services/searchService.js";
import type { SearchFilters } from "../types/index.js"; // Make sure path is correct

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, tag, rating, priceRange, sort } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Query param 'q' is required" });
    }

    const filters: SearchFilters = {
      q,
      ...(tag && typeof tag === "string" ? { tag } : {}),
      ...(rating && !isNaN(Number(rating)) ? { rating: parseFloat(rating as string) } : {}),
      ...(priceRange === "lt300" || priceRange === "300to600" ? { priceRange } : {}),
      ...(sort === "price_asc" || sort === "price_desc" ? { sort } : {}),
    };

    const results = await searchProductsService(filters);
    res.json(results);
  } catch (error) {
    next(error);
  }
};
