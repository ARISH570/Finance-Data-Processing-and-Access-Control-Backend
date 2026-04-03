import {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    monthlyTrends
} from '../services/dashboardService.js';

// Total Income Handler
export const totalIncomeHandler = async (req, res, next) => {
    try {
        const result = await totalIncome();

        const total = result[0]?.total || 0;

        res.json({ total });
    } catch (error) {
        next(error);
    }
};

// Total Expenses Handler
export const totalExpensesHandler = async (req, res, next) => {
    try {
        const result = await totalExpenses();

        const total = result[0]?.total || 0;

        res.json({ total });
    } catch (error) {
        next(error);
    }
};

// Net Balance Handler
export const netBalanceHandler = async (req, res, next) => {
    try {
        const net = await netBalance();

        res.json({ net });
    } catch (error) {
        next(error);
    }
};

// Category Totals Handler
export const categoryTotalsHandler = async (req, res, next) => {
    try {
        const result = await categoryTotals();

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Monthly Trends Handler
export const monthlyTrendsHandler = async (req, res, next) => {
    try {
        const result = await monthlyTrends();

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Combined Dashboard Handler
export const dashboardHandler = async (req, res, next) => {
    try {
        const [totalInc, totalExp, netBal, catTotals, monthTrends] = await Promise.all([
            totalIncome(),
            totalExpenses(),
            netBalance(),
            categoryTotals(),
            monthlyTrends()
        ]);

        res.json({
            totalIncome: totalInc[0]?.total || 0,
            totalExpenses: totalExp[0]?.total || 0,
            netBalance: netBal,
            categoryTotals: catTotals,
            monthlyTrends: monthTrends
        });
    } catch (error) {
        next(error);
    }
};