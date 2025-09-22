import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from "../controllers/wishlistController.js";
 
import { authenticateToken } from "../middlewares/authMiddleware.js";
 
const router = Router();
 
 
router.use(authenticateToken);
 
router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);
 
export default router;