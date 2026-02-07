import { Task } from '../models/Task.js';
import { parsePagination } from '../utils/pagination.js';

export const createTask = async (payload, userId) => Task.create({ ...payload, createdBy: userId });

export const getOverdueTasks = async (query) => {
  const { limit, skip, page } = parsePagination(query);
  const filters = {
    dueDate: { $lt: new Date() },
    status: { $nin: ['Completed'] },
  };

  if (query.assignedTo) filters.assignedTo = query.assignedTo;

  const [tasks, total] = await Promise.all([
    Task.find(filters).sort({ dueDate: 1 }).skip(skip).limit(limit),
    Task.countDocuments(filters),
  ]);

  return {
    data: tasks,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
};

export const markMissedDeadlines = async () => {
  const result = await Task.updateMany(
    { dueDate: { $lt: new Date() }, status: { $in: ['Open', 'InProgress'] } },
    { $set: { status: 'Missed' } }
  );

  return result.modifiedCount;
};
