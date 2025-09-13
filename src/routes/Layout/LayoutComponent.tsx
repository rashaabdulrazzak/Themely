// AppRoutes.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import'../../styles/global.css';
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
import PrivateRoute from "../../PrivateRoute";
import { useAuth } from "../../AuthContext";



const PrivateLayout = () => {
  const { user } = useAuth();
  console.log("Current user in AppRoutes:", user);
  return (
    <div>
      {user && <NavBar />}
      <main><Outlet /></main>
    </div>
  );
};

export default function AppRoutes() {
  const { user,token} = useAuth();
  console.log("Current user in AppRoutes:", user, token);
  return (
    <>
    {token && <NavBar />}
        <Routes>
      {/* public */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      {/* protected (everything inside requires auth) */}
      
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/users" element={<Users />} />
          <Route path="/canvases" element={<Canvases />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/payments" element={<Payments />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
    </>

  );
}
