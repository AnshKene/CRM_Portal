import { Router } from 'express';
import { createTaskController, getOverdueTasksController } from '../controllers/task.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/rbac.middleware.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

router.use(requireAuth);
router.post('/', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER), createTaskController);
router.get('/overdue', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_EXECUTIVE), getOverdueTasksController);

export default router;
