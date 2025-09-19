import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken); 

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/:cartId', cartController.removeCartItem);

export default router;
