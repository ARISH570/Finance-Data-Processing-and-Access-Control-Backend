import express from 'express';
import { createUserHandler, getUsersHandler, patchUserHandler } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticate);
router.post('/', authorize('admin'), createUserHandler);
router.get('/', authorize('admin', 'analyst', 'viewer'), getUsersHandler);
router.patch('/:id', authorize('admin'), patchUserHandler);

export default router;
