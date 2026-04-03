import Record from '../models/recordModel.js';

export const createRecord = async (data) => Record.create(data);

export const getRecords = async (filter, { page = 1, limit = 20 } = {}) => {
    const q = { ...filter, isDeleted: false };
    const skip = (page - 1) * limit;
    const records = await Record.find(q).sort({ date: -1 }).skip(skip).limit(limit);
    const total = await Record.countDocuments(q);
    return { records, total, page, limit };
};

export const updateRecord = async (id, changes) => {
    const record = await Record.findById(id);
    if (!record || record.isDeleted) throw { status: 404, message: 'Record not found' };
    Object.assign(record, changes);
    await record.save();
    return record;
};

export const softDeleteRecord = async (id) => {
    const record = await Record.findById(id);
    if (!record || record.isDeleted) throw { status: 404, message: 'Record not found' };
    record.isDeleted = true;
    await record.save();
    return record;
};
