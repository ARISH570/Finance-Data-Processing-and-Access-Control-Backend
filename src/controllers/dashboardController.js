import { totalIncome, totalExpenses, netBalance, categoryTotals, monthlyTrends } from '../services/dashboardService.js';

export const totalIncomeHandler = async (req, res, next) => { try { const result = await totalIncome(); res.json({ total: result[0]?.total || 0 }); } catch (e) { next(e); } };

export const totalExpensesHandler = async (req, res, next) => { try { const result = await totalExpenses(); res.json({ total: result[0]?.total || 0 }); } catch (e) { next(e); } };

export const netBalanceHandler = async (req, res, next) => { try { const net = await netBalance(); res.json({ net }); } catch (e) { next(e); } };

export const categoryTotalsHandler = async (req, res, next) => { try { const result = await categoryTotals(); res.json(result); } catch (e) { next(e); } };

export const monthlyTrendsHandler = async (req, res, next) => { try { const result = await monthlyTrends(); res.json(result); } catch (e) { next(e); } };

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
  } catch (e) {
    next(e);
  }
};

