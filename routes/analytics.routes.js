import { Router } from 'express';
import {
  dealsWonLostController,
  leadConversionRateController,
  monthlyRevenueController,
  salesPerformanceController,
} from '../controllers/analytics.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/rbac.middleware.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

router.use(requireAuth);
router.use(authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER));

router.get('/lead-conversion-rate', leadConversionRateController);
router.get('/deals-won-lost', dealsWonLostController);
router.get('/sales-performance', salesPerformanceController);
router.get('/monthly-revenue', monthlyRevenueController);

export default router;
