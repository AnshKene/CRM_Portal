import { Router } from 'express';
import {
  assignLeadController,
  convertLeadController,
  createLeadController,
  deleteLeadController,
  listLeadController,
  updateLeadController,
} from '../controllers/lead.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/rbac.middleware.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

router.use(requireAuth);

router.get('/', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_EXECUTIVE), listLeadController);
router.post('/', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_EXECUTIVE), createLeadController);
router.patch('/:leadId', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_EXECUTIVE), updateLeadController);
router.delete('/:leadId', authorizeRoles(USER_ROLES.ADMIN), deleteLeadController);
router.patch('/:leadId/assign', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER), assignLeadController);
router.post('/:leadId/convert', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER), convertLeadController);

export default router;
