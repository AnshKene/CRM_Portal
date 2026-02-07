import mongoose from 'mongoose';
import { TASK_PRIORITY, TASK_STATUS } from '../utils/constants.js';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    relatedEntity: {
      entityType: { type: String, enum: ['Lead', 'Deal'], required: true, index: true },
      entityId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    },
    dueDate: { type: Date, required: true, index: true },
    priority: { type: String, enum: TASK_PRIORITY, default: 'Medium', index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: TASK_STATUS, default: 'Open', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

taskSchema.index({ assignedTo: 1, status: 1, dueDate: 1 });

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
