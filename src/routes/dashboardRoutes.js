import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { totalIncomeHandler, totalExpensesHandler, netBalanceHandler, categoryTotalsHandler, monthlyTrendsHandler, dashboardHandler } from '../controllers/dashboardController.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorize('admin', 'analyst', 'viewer'), dashboardHandler);
router.get('/total-income', authorize('admin', 'analyst', 'viewer'), totalIncomeHandler);
router.get('/total-expenses', authorize('admin', 'analyst', 'viewer'), totalExpensesHandler);
router.get('/net-balance', authorize('admin', 'analyst', 'viewer'), netBalanceHandler);
router.get('/category-totals', authorize('admin', 'analyst', 'viewer'), categoryTotalsHandler);
router.get('/monthly-trends', authorize('admin', 'analyst', 'viewer'), monthlyTrendsHandler);

export default router;
