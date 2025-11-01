// contexts/PermissionContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth

// Define types locally if you don't have a separate types file yet
export type Role = 'ADMIN' | 'TEMPLATECREATOR' | 'USER' | 'DESIGNER';
export type Status = 'ACTIVE' | 'INACTIVE' | 'BANNED';
export type Permission = 
  | 'ADMIN_FULL_ACCESS'
  | 'TEMPLATE_VIEW_ALL'
  | 'TEMPLATE_VIEW_OWN'
  | 'TEMPLATE_CREATE_OWN'
  | 'TEMPLATE_CREATE_ALL'
  | 'TEMPLATE_EDIT_OWN'
  | 'TEMPLATE_EDIT_ALL'
  | 'TEMPLATE_DELETE_OWN'
  | 'TEMPLATE_DELETE_ALL'
  | 'CANVAS_VIEW_ALL'
  | 'CANVAS_VIEW_OWN'
  | 'CANVAS_CREATE_OWN'
  | 'CANVAS_CREATE_ALL'
  | 'CANVAS_EDIT_OWN'
  | 'CANVAS_EDIT_ALL'
  | 'CANVAS_DELETE_OWN'
  | 'CANVAS_DELETE_ALL'
  | 'USER_VIEW_ALL'
  | 'USER_CREATE'
  | 'USER_EDIT_ALL'
  | 'USER_DELETE_ALL'
  | 'USER_BAN'
  | 'USER_UNBAN'
  | 'PAYMENT_VIEW_ALL'
  | 'PAYMENT_VIEW_OWN'
  | 'PAYMENT_CREATE'
  | 'PAYMENT_EDIT_ALL'
  | 'PAYMENT_DELETE_ALL'
  | 'REVIEW_VIEW_ALL'
  | 'REVIEW_VIEW_OWN'
  | 'REVIEW_CREATE'
  | 'REVIEW_EDIT_ALL'
  | 'REVIEW_DELETE_ALL'
  | 'DOWNLOAD_VIEW_ALL'
  | 'DOWNLOAD_VIEW_OWN'
  | 'DOWNLOAD_DELETE_ALL'
  | 'ANALYTICS_VIEW_ALL'
  | 'ANALYTICS_VIEW_OWN'
  | 'ANALYTICS_EDIT_ALL'
  | 'SYSTEM_SETTINGS_EDIT'
  | 'SYSTEM_LOGS_VIEW';

export type Panel = 'templates' | 'users' | 'canvases' | 'downloads' | 'payments' | 'reviews' | 'insights';

interface PermissionContextType {
  userRole: Role | null;
  userId: string | null;
  hasPermission: (permission: Permission) => boolean;
  canAccessPanel: (panel: Panel) => boolean;
  canManageResource: (resourceUserId: string, resourceType: string) => boolean;
  isAdmin: boolean;
  isTEMPLATECREATOR: boolean;
  isUser: boolean;
  loading: boolean; // Add loading state
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// Permission mappings
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  USER: [
    'CANVAS_VIEW_OWN',
    'CANVAS_CREATE_OWN',
    'CANVAS_EDIT_OWN',
    'CANVAS_DELETE_OWN',
    'TEMPLATE_VIEW_ALL', // Users can browse all templates
    'PAYMENT_VIEW_OWN',
    'REVIEW_VIEW_OWN',
    'REVIEW_CREATE',
    'DOWNLOAD_VIEW_OWN',
  ],
  DESIGNER:[
    // Canvas permissions
    'CANVAS_VIEW_ALL',
    'CANVAS_EDIT_ALL',
   
    // Template permissions
    'TEMPLATE_VIEW_ALL',
    'TEMPLATE_EDIT_ALL',
   
  ],
  TEMPLATECREATOR: [
    // Canvas permissions
    'CANVAS_VIEW_OWN',
    'CANVAS_CREATE_OWN',
    'CANVAS_EDIT_OWN',
    'CANVAS_DELETE_OWN',
    
    // Template permissions
    'TEMPLATE_VIEW_ALL',
    'TEMPLATE_CREATE_OWN',
    'TEMPLATE_EDIT_OWN',
    'TEMPLATE_DELETE_OWN',
    
    // Analytics permissions
    'ANALYTICS_VIEW_OWN',
    
    // Payment permissions
    'PAYMENT_VIEW_OWN',
    
    // Review permissions
    'REVIEW_VIEW_OWN',
    'REVIEW_CREATE',
    
    // Download permissions
    'DOWNLOAD_VIEW_OWN',
  ],
  
  ADMIN: [
    // Global admin access
    'ADMIN_FULL_ACCESS',
    
    // Template management
    'TEMPLATE_VIEW_ALL',
    'TEMPLATE_CREATE_ALL',
    'TEMPLATE_EDIT_ALL',
    'TEMPLATE_DELETE_ALL',
    
    // Canvas management
    'CANVAS_VIEW_ALL',
    'CANVAS_CREATE_ALL',
    'CANVAS_EDIT_ALL',
    'CANVAS_DELETE_ALL',
    
    // User management
    'USER_VIEW_ALL',
    'USER_CREATE',
    'USER_EDIT_ALL',
    'USER_DELETE_ALL',
    'USER_BAN',
    'USER_UNBAN',
    
    // Download management
    'DOWNLOAD_VIEW_ALL',
    'DOWNLOAD_DELETE_ALL',
    
    // Payment management
    'PAYMENT_VIEW_ALL',
    'PAYMENT_CREATE',
    'PAYMENT_EDIT_ALL',
    'PAYMENT_DELETE_ALL',
    
    // Review management
    'REVIEW_VIEW_ALL',
    'REVIEW_EDIT_ALL',
    'REVIEW_DELETE_ALL',
    
    // Analytics
    'ANALYTICS_VIEW_ALL',
    'ANALYTICS_EDIT_ALL',
    
    // System management
    'SYSTEM_SETTINGS_EDIT',
    'SYSTEM_LOGS_VIEW',
  ]
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth(); // Get user from AuthContext
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Sync with AuthContext user data

useEffect(() => {
  console.log('PermissionContext: Syncing with AuthContext user:', user);
  
  if (user) {
     setUserRole(user.role)
    setUserId(user.id.toString());
    console.log('PermissionContext: Updated role to:', user.role, 'userId to:', user.id);
  } else if (!authLoading) {
    // Only clear if auth is done loading and there's no user
    setUserRole(null);
    setUserId(null);
    console.log('PermissionContext: Cleared role and userId');
  }
}, [user, authLoading]); // Add authLoading to dependencies

  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) {
      console.log('PermissionContext: hasPermission - no userRole');
      return false;
    }
    
    // Admin has all permissions
    if (userRole === 'ADMIN') {
      console.log('PermissionContext: hasPermission - ADMIN has all permissions');
      return true;
    }
    
    const rolePerms = ROLE_PERMISSIONS[userRole] || [];
    const hasAccess = rolePerms.includes(permission);
    console.log(`PermissionContext: hasPermission - ${userRole} has ${permission}:`, hasAccess);
    return hasAccess;
  };

  const canAccessPanel = (panel: Panel): boolean => {
    if (!userRole) {
      console.log('PermissionContext: canAccessPanel - no userRole');
      return false;
    }
    
    // Admin can access all panels
    if (userRole === 'ADMIN') {
      console.log('PermissionContext: canAccessPanel - ADMIN can access all panels');
      return true;
    }
    
    // Template Creator can only access insights panel
    if (userRole === 'TEMPLATECREATOR' || userRole === 'TEMPLATECREATOR') {
      const canAccess = panel === 'insights';
      console.log(`PermissionContext: canAccessPanel - TEMPLATECREATOR can access ${panel}:`, canAccess);
      return canAccess;
    }
    
    // Regular users cannot access management panels
    console.log('PermissionContext: canAccessPanel - USER cannot access management panels');
    return false;
  };

  const canManageResource = (resourceUserId: string, resourceType: string): boolean => {
    if (!userRole || !userId) {
      console.log('PermissionContext: canManageResource - no userRole or userId');
      return false;
    }
    
    // Admin can manage anything
    if (userRole === 'ADMIN') {
      console.log('PermissionContext: canManageResource - ADMIN can manage anything');
      return true;
    }
    
    // Template Creator can manage their own templates and canvases
    if (userRole === 'TEMPLATECREATOR') {
      const canManage = userId === resourceUserId;
      console.log(`PermissionContext: canManageResource - TEMPLATECREATOR can manage own resources:`, canManage);
      return canManage;
    }
    
    // Users can only manage their own canvases
    if (userRole === 'USER' && resourceType === 'canvas') {
      const canManage = userId === resourceUserId;
      console.log(`PermissionContext: canManageResource - USER can manage own canvas:`, canManage);
      return canManage;
    }
    
    return false;
  };

  const value: PermissionContextType = {
    userRole,
    userId,
    hasPermission,
    canAccessPanel,
    canManageResource,
    isAdmin: userRole === 'ADMIN',
    isTEMPLATECREATOR: userRole === 'TEMPLATECREATOR',
    isUser: userRole === 'USER',
    loading: authLoading || !userRole  
  };

  console.log('PermissionContext: Current state:', {
    userRole,
    userId,
    isAdmin: userRole === 'ADMIN',
    loading: authLoading
  });

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// Export the hook
export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

// Default export (optional)
export default PermissionContext;
