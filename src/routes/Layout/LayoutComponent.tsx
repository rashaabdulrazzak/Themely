import React from 'react';
import { BrowserRouter as Router , Routes, Route, useLocation } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import'../../styles/global.css'
import "primereact/resources/themes/lara-light-teal/theme.css";
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import Home from '../../pages/Home';
import Login from '../../pages/Login';

const LayoutComponent = () => {
  const location = useLocation()
     const isLoginPage = location.pathname === '/login';
  return (
    
    <div>
      {!isLoginPage && <NavBar />}
      <main>
      <Routes>
      <Route  path='/login' element={<Login/>}></Route>
      <Route path='/' element={<Home/>}></Route>
      </Routes>
      </main>
    </div>
  );
};

export default LayoutComponent;
