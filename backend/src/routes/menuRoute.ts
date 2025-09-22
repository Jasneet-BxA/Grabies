import { Router } from "express";
import { getFilteredMenu, getProductsByCategory, getProductByName, getAllProducts } from "../controllers/menuController.js";
 
const router = Router();
 
router.get("/", getAllProducts)
router.get("/:category", getProductsByCategory);
router.get("/:category/filters", getFilteredMenu);
router.get("/:category/:productName", getProductByName);
 
export default router;