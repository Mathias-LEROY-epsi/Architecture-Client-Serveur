import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from './features/components';
import { NotFound, Home, Authentification, Catalog } from './features/views';
import './index.css';

export const App = () => {
  return (
    <div className="App">
      <Router>
          <NavBar />
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/catalogue-bieres" element={<Catalog />} />
            <Route path="/auth0" element={<Authentification />} />
          </Routes>
      </Router>
    </div>
  );
};
