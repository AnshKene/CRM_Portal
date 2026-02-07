import mongoose from 'mongoose';
import { CUSTOMER_LIFECYCLE_STAGES } from '../utils/constants.js';

const noteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: '' },
    lifecycleStage: { type: String, enum: CUSTOMER_LIFECYCLE_STAGES, default: 'Prospect', index: true },
    tags: { type: [String], default: [] },
    notes: { type: [noteSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

customerSchema.index({ lifecycleStage: 1, createdAt: -1 });

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
