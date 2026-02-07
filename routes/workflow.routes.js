import { Router } from 'express';
import { Workflow } from '../models/Workflow.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/rbac.middleware.js';
import { USER_ROLES } from '../utils/constants.js';

const router = Router();

router.use(requireAuth, authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER));

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const workflow = await Workflow.create(req.body);
    res.status(201).json(workflow);
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const workflows = await Workflow.find().sort({ createdAt: -1 });
    res.status(200).json(workflows);
  })
);

export default router;
