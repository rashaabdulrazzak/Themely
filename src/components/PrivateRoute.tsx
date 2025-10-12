  // PrivateRoute.tsx (Simplified)
  import { Navigate, Outlet, useLocation } from "react-router-dom";
  import { useAuth } from "../contexts/AuthContext";
  import { PermissionProvider } from "../contexts/PermissionContext";

  export default function PrivateRoute() {
    const { user, token, loading } = useAuth();
    const location = useLocation();
    console.log("Current user in PrivateRoute:", user);
    const myUser = localStorage.getItem("user");
    console.log("User from localStorage in PrivateRoute:", myUser);

    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <i className="pi pi-spinner pi-spin text-4xl text-blue-500 mb-4"></i>
            <p className="text-gray-600">Checking session...</p>
          </div>
        </div>
      );
    }

    // If not authenticated, redirect to login
    if (!token || !myUser) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // User is authenticated, render protected routes with permission context
    return (
      <PermissionProvider>
        <Outlet />
      </PermissionProvider>
    );
  }
