import { createRecord, getRecords, updateRecord, softDeleteRecord } from '../services/recordService.js';

export const createRecordHandler = async (req, res, next) => { try { const { amount, type, category, date } = req.body; if (!amount || amount <= 0 || !type || !category || !date) return next({ status: 400, message: 'amount>0,type,category,date required' }); const record = await createRecord({ amount, type, category, date, note: req.body.note || '', createdBy: req.user._id }); res.status(201).json(record); } catch (e) { next(e); } };

export const getRecordsHandler = async (req, res, next) => { try { const filter = {}; const { startDate, endDate, type, category, page, limit } = req.query; if (startDate || endDate) { filter.date = {}; if (startDate) filter.date.$gte = new Date(startDate); if (endDate) filter.date.$lte = new Date(endDate); } if (type) filter.type = type; if (category) filter.category = category; const result = await getRecords(filter, { page: Number(page) || 1, limit: Number(limit) || 20 }); res.json(result); } catch (e) { next(e); } };

export const updateRecordHandler = async (req, res, next) => { try { const { id } = req.params; const updates = req.body; if (updates.amount && updates.amount <= 0) return next({ status: 400, message: 'amount must be >0' }); const record = await updateRecord(id, updates); res.json(record); } catch (e) { next(e); } };

export const deleteRecordHandler = async (req, res, next) => { try { const { id } = req.params; const record = await softDeleteRecord(id); res.json({ message: 'Record soft deleted', record }); } catch (e) { next(e); } };
