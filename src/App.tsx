import LayoutComponent from './routes/Layout/LayoutComponent';
import './styles/App.scss'
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter } from 'react-router-dom';
import './styles/App.scss'
import { AuthProvider } from './AuthContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
     return (
    <div className="App">
      <BrowserRouter>
      <AuthProvider>
    
      <PrimeReactProvider>
      <LayoutComponent/>
      </PrimeReactProvider>
       </AuthProvider>
      </BrowserRouter>
           <ToastContainer newestOnTop position="top-right" theme="dark" />

    </div>
     )
}

export default App
