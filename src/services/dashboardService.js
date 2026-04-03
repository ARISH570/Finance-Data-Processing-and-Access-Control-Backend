import Record from '../models/recordModel.js';
const activeMatch = { isDeleted: false };
export const totalIncome = () => Record.aggregate([{ $match: { ...activeMatch, type: 'income' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
export const totalExpenses = () => Record.aggregate([{ $match: { ...activeMatch, type: 'expense' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
export const netBalance = async () => { const [inc] = await totalIncome(); const [exp] = await totalExpenses(); return (inc?.total || 0) - (exp?.total || 0); };
export const categoryTotals = () => Record.aggregate([{ $match: activeMatch }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $project: { category: '$_id', total: 1, _id: 0 } }, { $sort: { total: -1 } }]);
export const monthlyTrends = () => Record.aggregate([{ $match: activeMatch }, { $addFields: { year: { $year: '$date' }, month: { $month: '$date' } } }, { $group: { _id: { year: '$year', month: '$month', type: '$type' }, total: { $sum: '$amount' } } }, { $group: { _id: { year: '$_id.year', month: '$_id.month' }, breakdown: { $push: { type: '$_id.type', total: '$total' } }, monthTotal: { $sum: '$total' } } }, { $project: { year: '$_id.year', month: '$_id.month', monthTotal: 1, breakdown: 1, _id: 0 } }, { $sort: { year: 1, month: 1 } }]);
