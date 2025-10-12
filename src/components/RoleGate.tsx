import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';
import type { Role } from '../modules';

interface RoleGateProps {
  children: React.ReactNode;
  roles: Role[];
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  roles,
  fallback = null
}) => {
  const { userRole } = usePermissions();

  const hasRole = userRole && roles.includes(userRole);

  return hasRole ? <>{children}</> : <>{fallback}</>;
};
