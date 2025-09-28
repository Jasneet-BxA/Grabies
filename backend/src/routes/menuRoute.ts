import { Router } from "express";
import { getFilteredMenu, getProductsByCategory, getProductByName, getAllProducts } from "../controllers/menuController.js";
 
const router = Router();
 
router.get("/", getAllProducts);
router.get("/:category/filters", getFilteredMenu); 
router.get("/:category/:productName", getProductByName);
router.get("/:category", getProductsByCategory); 

 
export default router;