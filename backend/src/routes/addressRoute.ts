import express from "express";
import {
  addAddress,
  getAddresses,
  deleteAddress,
} from "../controllers/addressController.js";
import { authenticateToken } from "middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", addAddress);
router.get("/", getAddresses);
router.delete("/:addressId", deleteAddress);

export default router;
