import mongoose from 'mongoose';
const recordSchema = new mongoose.Schema({ amount: { type: Number, required: true, min: 0.01 }, type: { type: String, enum: ['income', 'expense'], required: true }, category: { type: String, required: true, trim: true }, date: { type: Date, required: true }, note: { type: String, default: '' }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, isDeleted: { type: Boolean, default: false } }, { timestamps: true });
const Record = mongoose.models.Record || mongoose.model('Record', recordSchema);
export default Record;