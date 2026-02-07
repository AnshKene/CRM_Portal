import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    throw new HttpError(401, 'Authentication token is required');
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
};
