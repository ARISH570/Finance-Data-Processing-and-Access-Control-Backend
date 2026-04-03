import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { createRecordHandler, getRecordsHandler, updateRecordHandler, deleteRecordHandler } from '../controllers/recordController.js';

const router = express.Router();
router.use(authenticate);
router.post('/', authorize('admin', 'analyst'), createRecordHandler);
router.get('/', authorize('admin', 'analyst', 'viewer'), getRecordsHandler);
router.patch('/:id', authorize('admin', 'analyst'), updateRecordHandler);
router.delete('/:id', authorize('admin', 'analyst'), deleteRecordHandler);

export default router;
