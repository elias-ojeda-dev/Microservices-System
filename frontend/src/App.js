import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import StartupsList from './components/Startups/StartupsList';
import TechnologiesList from './components/Technologies/TechnologiesList';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <div className="header-content">
              <Link to="/" className="logo" onClick={closeMobileMenu}>
                Sistema de gestión
              </Link>
              <button
                type="button"
                className="mobile-menu-btn"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileMenuOpen}
                aria-controls="main-navigation"
                onClick={() => setMobileMenuOpen(open => !open)}
              >
                <span aria-hidden="true">{mobileMenuOpen ? '✕' : '☰'}</span>
              </button>
              <nav id="main-navigation" aria-label="Navegación principal" className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                  end
                >
                  Inicio
                </NavLink>
                <NavLink
                  to="/startups"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Startups
                </NavLink>
                <NavLink
                  to="/technologies"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Tecnologías
                </NavLink>
              </nav>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/startups" element={<StartupsList />} />
              <Route path="/technologies" element={<TechnologiesList />} />
            </Routes>
          </div>
        </main>

        <footer className="footer">
          <p>© 2025 Reto Técnico - Sistema de Microservicios</p>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h1 className="page-title">
        Bienvenido al Sistema de Microservicios
      </h1>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Startups</h2>
          </div>
          <div className="card-body">
            <p className="card-description">
              Gestiona información de startups incluyendo datos de fundación,
              ubicación, categoría e inversión recibida.
            </p>
            <Link to="/startups" className="btn btn-primary">
              Gestionar Startups
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Tecnologías</h2>
          </div>
          <div className="card-body">
            <p className="card-description">
              Administra tecnologías por sector, descripción y nivel de adopción
              en el mercado actual.
            </p>
            <Link to="/technologies" className="btn btn-primary">
              Gestionar Tecnologías
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
