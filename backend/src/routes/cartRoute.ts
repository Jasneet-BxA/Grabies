import { Router } from 'express';
import { getCart, addToCart, removeCartItem } from '../controllers/cartController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken); 

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:cartId', removeCartItem);

export default router;
