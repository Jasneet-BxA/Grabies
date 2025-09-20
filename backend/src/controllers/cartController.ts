import type { NextFunction, Request, Response } from "express";
import { addToCartSchema } from "../validators/productValidator.js";
import {
  getCartService,
  addToCartService,
  removeCartItemService,
} from "../services/cartService.js";

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = await getCartService(userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const validatedData = addToCartSchema.parse(req.body);
    const data = await addToCartService(userId, validatedData);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const cartId = req.params.cartId!;
    const result = await removeCartItemService(userId, cartId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
