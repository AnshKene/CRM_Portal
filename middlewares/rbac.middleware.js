import { HttpError } from '../utils/httpError.js';
import { USER_ROLES } from '../utils/constants.js';

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole) {
    throw new HttpError(401, 'User context is missing');
  }

  if (!allowedRoles.includes(userRole)) {
    throw new HttpError(403, 'Insufficient role permissions');
  }

  next();
};

export const canAccessAssignedEntity = (ownerField = 'assignedTo') => (req, res, next) => {
  const { role, id } = req.user;

  if ([USER_ROLES.ADMIN, USER_ROLES.SALES_MANAGER].includes(role)) {
    return next();
  }

  const requestedAssignee = req.params[ownerField] || req.query[ownerField] || req.body[ownerField];
  if (requestedAssignee && requestedAssignee !== id) {
    throw new HttpError(403, 'You can only access your assigned records');
  }

  return next();
};
