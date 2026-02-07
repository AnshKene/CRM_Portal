import { Router } from 'express';
import analyticsRoutes from './analytics.routes.js';
import dealRoutes from './deal.routes.js';
import leadRoutes from './lead.routes.js';
import taskRoutes from './task.routes.js';
import workflowRoutes from './workflow.routes.js';

const router = Router();

router.use('/leads', leadRoutes);
router.use('/deals', dealRoutes);
router.use('/tasks', taskRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/workflows', workflowRoutes);

export default router;
