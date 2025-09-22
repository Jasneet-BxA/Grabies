import type { Request, Response, NextFunction } from "express";
import {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService
} from "../services/wishlistService.js";
 
export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
 
    const wishlist = await getWishlistService(userId);
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};
 
export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const productId = req.params.productId;
 
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!productId) return res.status(400).json({ error: "Product ID is required" });
 
    await addToWishlistService(userId, productId);
    res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    next(error);
  }
};
 
export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const productId = req.params.productId;
 
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!productId) return res.status(400).json({ error: "Product ID is required" });
 
    await removeFromWishlistService(userId, productId);
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    next(error);
  }
};
 
 