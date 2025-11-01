import React from 'react';
import { usePermissions, type Panel, type Permission } from '../contexts/PermissionContext';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  panel?: string;
  resourceUserId?: string;
  resourceType?: string;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If multiple conditions, require all to be true
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  panel,
  resourceUserId,
  resourceType,
  fallback = null,
  requireAll = true
}) => {
  const permissions = usePermissions();

  const checks: boolean[] = [];

  // Check permission
  if (permission) {
    checks.push(permissions.hasPermission(permission as Permission));
  }

  // Check panel access
  if (panel) {
    checks.push(permissions.canAccessPanel(panel as Panel));
  }

  // Check resource management
  if (resourceUserId && resourceType) {
    checks.push(permissions.canManageResource(resourceUserId, resourceType));
  }

  // Determine if access should be granted
  const hasAccess = requireAll 
    ? checks.every(check => check)
    : checks.some(check => check);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
