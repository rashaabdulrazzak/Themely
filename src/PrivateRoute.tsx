// PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute() {
  const { user,token } = useAuth();
  const location = useLocation();
  console.log("Current user in PrivateRoute:", user);

  // if (loading) return <div style={{ padding: 24 }}>Checking session…</div>;
if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
