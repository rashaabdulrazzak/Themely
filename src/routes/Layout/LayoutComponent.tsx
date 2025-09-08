import {  Routes, Route, useLocation } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import'../../styles/global.css'
import "primereact/resources/themes/lara-light-teal/theme.css";
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import Home from '../../pages/Home';
import Reviews from '../../pages/Reviews';
import Users from '../../pages/Users';
import Downloads from '../../pages/Downloads';
import Canvases from '../../pages/Canvases';
import Payments from '../../pages/Payments';
import Login from '../../pages/Login';
import Templates from '../../pages/Templates';
import { useAuth } from '../../AuthContext';

const LayoutComponent = () => {
  // const location = useLocation()
//     const isLoginPage = location.pathname === '/login';
          const { user } = useAuth();
  return (
    
    <div>
     {/*  {!isLoginPage && <NavBar />} */}
      <main>
         {user && <NavBar />}
      <Routes>
        { user ?<>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/reviews" element={<Reviews />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/canvases" element={<Canvases />}></Route>
        <Route path="/templates" element={<Templates />}></Route>
        <Route path="/downloads" element={<Downloads />}></Route>
        <Route path="/payments" element={<Payments />}></Route>
        </> : <>
              <Route  path='/login' element={<Login/>}></Route>
        <Route  path='*' element={<Login/>}></Route>

        </>}
      

      </Routes>
      </main>
    </div>
  );
};

export default LayoutComponent;
