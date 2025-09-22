import { Router } from "express";
import { getFilteredMenu, getProductsByCategory } from "../controllers/menuController.js";
 
const router = Router();
 
router.get("/:category", getProductsByCategory);
router.get("/:category/filters", getFilteredMenu);
 
export default router;