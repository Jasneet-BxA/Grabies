import type { Request, Response, NextFunction } from "express";
import {
  addAddressService,
  getAddressesService,
  deleteAddressService,
} from "../services/addressService.js";
import { addressSchema, updateAddressSchema } from "../validators/addressValidator.js";

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const data = addressSchema.parse(req.body);
    const address = await addAddressService(userId, data);
    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const addresses = await getAddressesService(userId);
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const addressId = req.params.addressId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!addressId) return res.status(401).json({ error: "Unauthorized" });

    const result = await deleteAddressService(userId, addressId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
