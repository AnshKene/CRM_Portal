import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    trigger: {
      type: String,
      enum: ['lead_created', 'lead_status_changed', 'deal_stage_changed'],
      required: true,
      index: true,
    },
    condition: {
      field: { type: String, required: true },
      operator: { type: String, enum: ['>', '<', '>=', '<=', '==', '!=', 'includes'], required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    action: {
      type: { type: String, enum: ['send_notification', 'create_task'], required: true },
      payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Workflow = mongoose.models.Workflow || mongoose.model('Workflow', workflowSchema);
