import mongoose from 'mongoose';
import { DEAL_STAGES } from '../utils/constants.js';

const dealHistorySchema = new mongoose.Schema(
  {
    fromStage: { type: String, enum: DEAL_STAGES, required: true },
    toStage: { type: String, enum: DEAL_STAGES, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    durationInPreviousStageHours: { type: Number, default: 0 },
  },
  { _id: false }
);

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    stage: { type: String, enum: DEAL_STAGES, default: 'Lead', index: true },
    dealValue: { type: Number, required: true, min: 0 },
    expectedCloseDate: { type: Date, required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lostReason: { type: String, default: null },
    history: { type: [dealHistorySchema], default: [] },
    stageUpdatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

dealSchema.index({ stage: 1, assignedTo: 1, updatedAt: -1 });

export const Deal = mongoose.models.Deal || mongoose.model('Deal', dealSchema);
