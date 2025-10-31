  // AppRoutes.tsx
  import { Routes, Route, Navigate, Outlet } from "react-router-dom";
  import NavBar from "../../components/NavBar";
  import '../../styles/global.css';
  import "primereact/resources/themes/lara-light-teal/theme.css"; 
  import 'primereact/resources/primereact.min.css';
  import 'primeicons/primeicons.css';
  import Home from "../../pages/Home";
  import Reviews from "../../pages/Reviews";
  import Users from "../../pages/Users";
  import Downloads from "../../pages/Downloads";
  import Canvases from "../../pages/Canvases";
  import Payments from "../../pages/Payments";
  import Login from "../../pages/Login";
  import Templates from "../../pages/Templates";
  //import Analytics from "../../pages/Analytics";
  import Unauthorized from "../../pages/Unauthorized";
  import PrivateRoute from "../../components/PrivateRoute";
  import ProtectedRoute from "../../components/ProtectedRoute";
  import { useAuth } from "../../contexts/AuthContext";

  // AppRoutes.tsx

  //import Analytics from "../../pages/Analytics";


  const PrivateLayout = () => {
    const { user } = useAuth();
    console.log("Current user in PrivateLayout:", user);
    
    return (
      <div className="min-h-screen bg-gray-50">
        {user && <NavBar />}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  };

  export default function AppRoutes() {
    const { user, token } = useAuth();
    console.log("Current user in AppRoutes:", user, token);

    return (
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />
        
      

        {/* Protected routes - requires authentication */}
        <Route element={<PrivateRoute />}>
       <Route path="/unauthorized" element={<Unauthorized />} /> 
          <Route element={<PrivateLayout />}>
            {/* Dashboard - accessible to all authenticated users */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Templates - Template Creators and Admins only */}
            <Route 
              path="/templates" 
              element={
                <ProtectedRoute roles={['ADMIN', 'TEMPLATECREATOR','USER','DESIGNER']}>
                  <Templates />
                </ProtectedRoute>
              } 
            />

            {/* Users Management - Admin only */}
            <Route 
              path="/users" 
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Users />
                </ProtectedRoute>
              } 
            />

            {/* Canvases Management - Admin only */}
            <Route 
              path="/canvases" 
              element={
                <ProtectedRoute roles={['ADMIN', 'TEMPLATECREATOR', 'USER','DESIGNER']}>
                  <Canvases />
                </ProtectedRoute>
              } 
            />

            {/* Downloads Management - Admin only */}
            <Route 
              path="/downloads" 
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Downloads />
                </ProtectedRoute>
              } 
            />

            {/* Payments Management - Admin only */}
            <Route 
              path="/payments" 
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Payments />
                </ProtectedRoute>
              } 
            />

            {/* Reviews Management - Admin only */}
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Reviews />
                </ProtectedRoute>
              } 
            />

            {/* Analytics - Admin and Template Creator */}
        {/*    <Route 
              path="/analytics" 
              element={
                <ProtectedRoute roles={['ADMIN', 'TemplateCreator']}>
                  <Analytics />
                </ProtectedRoute>
              } 
            /> */}

            {/* User Profile - All authenticated users */}
            <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />

            {/* Settings - Role-based access */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute roles={['ADMIN', 'TEMPLATECREATOR']}>
                  <div>Settings Page (Admin Only)</div>
                </ProtectedRoute>
              } 
            />
          </Route>
        </Route>

        {/* Fallback routes */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    );
  }

