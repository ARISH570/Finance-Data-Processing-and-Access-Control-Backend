import Record from '../models/recordModel.js';

const activeMatch = { isDeleted: false };

// Total Income
export const totalIncome = async () => {
    const result = await Record.aggregate([
        {
            $match: {
                ...activeMatch,
                type: 'income'
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);

    return result;
};

// Total Expenses
export const totalExpenses = async () => {
    const result = await Record.aggregate([
        {
            $match: {
                ...activeMatch,
                type: 'expense'
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);

    return result;
};

// Net Balance
export const netBalance = async () => {
    const incomeResult = await totalIncome();
    const expenseResult = await totalExpenses();

    const income = incomeResult[0]?.total || 0;
    const expense = expenseResult[0]?.total || 0;

    const balance = income - expense;

    return balance;
};

// Category Totals
export const categoryTotals = async () => {
    const result = await Record.aggregate([
        {
            $match: activeMatch
        },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' }
            }
        },
        {
            $project: {
                category: '$_id',
                total: 1,
                _id: 0
            }
        },
        {
            $sort: {
                total: -1
            }
        }
    ]);

    return result;
};

// Monthly Trends
export const monthlyTrends = async () => {
    const result = await Record.aggregate([
        {
            $match: activeMatch
        },
        {
            $addFields: {
                year: { $year: '$date' },
                month: { $month: '$date' }
            }
        },
        {
            $group: {
                _id: {
                    year: '$year',
                    month: '$month',
                    type: '$type'
                },
                total: { $sum: '$amount' }
            }
        },
        {
            $group: {
                _id: {
                    year: '$_id.year',
                    month: '$_id.month'
                },
                breakdown: {
                    $push: {
                        type: '$_id.type',
                        total: '$total'
                    }
                },
                monthTotal: { $sum: '$total' }
            }
        },
        {
            $project: {
                year: '$_id.year',
                month: '$_id.month',
                monthTotal: 1,
                breakdown: 1,
                _id: 0
            }
        },
        {
            $sort: {
                year: 1,
                month: 1
            }
        }
    ]);

    return result;
};