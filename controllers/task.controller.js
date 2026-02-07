import { asyncHandler } from '../utils/asyncHandler.js';
import * as taskService from '../services/task.service.js';

export const createTaskController = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.id);
  res.status(201).json(task);
});

export const getOverdueTasksController = asyncHandler(async (req, res) => {
  const tasks = await taskService.getOverdueTasks(req.query);
  res.status(200).json(tasks);
});
