import LayoutComponent from './routes/Layout/LayoutComponent';
import './styles/App.scss'
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter } from 'react-router-dom';
import './styles/App.scss'

function App() {
     return (
    <div className="App">
      <BrowserRouter>
      <PrimeReactProvider>
      <LayoutComponent/>
      </PrimeReactProvider>
      </BrowserRouter>
    </div>
     )
}

export default App
