// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { usePermissions } from "../contexts/PermissionContext";
import type { Role } from "../modules";

interface ProtectedRouteProps {
  roles: Role[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { userRole, loading } = usePermissions();
  
  console.log("ProtectedRoute check:", { userRole, loading, requiredRoles: roles });

  // CRITICAL: Wait for permission context to load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="pi pi-spinner pi-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (!userRole ||
  !roles.map(r => r.toUpperCase()).includes(userRole.toUpperCase())) {
    console.log("Access denied - redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("Access granted for role:", userRole);
  return <>{children}</>;
}

// Updated PermissionContext.tsx - Add to your existing file
// Key changes in the useEffect:

/*
useEffect(() => {
  console.log('PermissionContext: Syncing with AuthContext user:', user);
  
  if (user) {
    setUserRole(user.role);
    setUserId(user.id);
    console.log('PermissionContext: Updated role to:', user.role, 'userId to:', user.id);
  } else if (!authLoading) {
    // Only clear if auth is done loading and there's no user
    setUserRole(null);
    setUserId(null);
    console.log('PermissionContext: Cleared role and userId');
  }
}, [user, authLoading]);
*/