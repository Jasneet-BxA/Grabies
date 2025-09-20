import type { Request, Response, NextFunction } from "express";
import { addressSchema, updateProfileSchema } from "../validators/userValidator.js";
import {
  getProfileService,
  updateProfileService,
  updateAddressService,
} from "../services/userService.js";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const data = await getProfileService(userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const fields = updateProfileSchema.parse(req.body);
    const data = await updateProfileService(userId, fields);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const addressFields = addressSchema.parse(req.body);
    const address = await updateAddressService(userId, addressFields);
    res.json({ message: "Address updated successfully", address });
  } catch (error) {
    next(error);
  }
};
