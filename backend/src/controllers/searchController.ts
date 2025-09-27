import type { Request, Response, NextFunction } from "express";
import { searchProductsService } from "../services/searchService.js";
import type { SearchFilters } from "../types/index.js";

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Query param 'q' is required" });
    }

    const filters: SearchFilters = { q  };

    const results = await searchProductsService(filters);
    res.json(results);
  } catch (error) {
    next(error);
  }
};
