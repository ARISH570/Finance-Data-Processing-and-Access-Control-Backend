import {
    createRecord,
    getRecords,
    updateRecord,
    softDeleteRecord
} from '../services/recordService.js';

// Create Record
export const createRecordHandler = async (req, res, next) => {
    try {
        const { amount, type, category, date, note } = req.body;

        // Validation
        if (!amount || amount <= 0 || !type || !category || !date) {
            return next({
                status: 400,
                message: 'amount > 0, type, category, and date are required'
            });
        }

        // Create Record
        const record = await createRecord({
            amount,
            type,
            category,
            date,
            note: note || '',
            createdBy: req.user._id
        });

        // Response
        res.status(201).json(record);

    } catch (error) {
        next(error);
    }
};

// Get Records (with filters + pagination)
export const getRecordsHandler = async (req, res, next) => {
    try {
        const filter = {};

        const {
            startDate,
            endDate,
            type,
            category,
            page,
            limit
        } = req.query;

        // Date Filter
        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }

            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }

        // Type Filter
        if (type) {
            filter.type = type;
        }

        // Category Filter
        if (category) {
            filter.category = category;
        }

        // Pagination options
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 20
        };

        // Fetch Records
        const result = await getRecords(filter, options);

        // Response
        res.json(result);

    } catch (error) {
        next(error);
    }
};

// Update Record
export const updateRecordHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validation
        if (updates.amount && updates.amount <= 0) {
            return next({
                status: 400,
                message: 'amount must be greater than 0'
            });
        }

        // Update Record
        const record = await updateRecord(id, updates);

        // Response
        res.json(record);

    } catch (error) {
        next(error);
    }
};

// Delete Record (Soft Delete)
export const deleteRecordHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Soft Delete
        const record = await softDeleteRecord(id);

        // Response
        res.json({
            message: 'Record soft deleted',
            record
        });

    } catch (error) {
        next(error);
    }
};