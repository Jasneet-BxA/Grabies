import { Router } from 'express';
import { getProfile, updateAddress, updateProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/address', updateAddress);

export default router;