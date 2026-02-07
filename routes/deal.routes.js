import { Router } from 'express';
import {
  createDealController,
  getConversionStatsController,
  getPipelineController,
  moveDealStageController,
  updateDealController,
} from '../controllers/deal.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/rbac.middleware.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

router.use(requireAuth);

router.post('/', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_EXECUTIVE), createDealController);
router.patch('/:dealId', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_EXECUTIVE), updateDealController);
router.patch('/:dealId/stage', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_EXECUTIVE), moveDealStageController);
router.get('/pipeline', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER), getPipelineController);
router.get('/stats/conversion', authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER), getConversionStatsController);

export default router;
