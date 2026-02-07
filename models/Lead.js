import mongoose from 'mongoose';
import { LEAD_STATUSES } from '../utils/constants.js';

const leadActivitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true, index: true },
    status: { type: String, enum: LEAD_STATUSES, default: 'New', index: true },
    score: { type: Number, default: 0, min: 0, max: 100, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activityHistory: { type: [leadActivitySchema], default: [] },
    convertedToCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, assignedTo: 1, createdAt: -1 });

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
