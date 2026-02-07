'use client';

export default function RoleBasedView({ userRole, allowedRoles, children, fallback = null }) {
  if (!allowedRoles.includes(userRole)) {
    return fallback;
  }

  return children;
}
