import { FC, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginButton from './authTwo/components/LoginButton';
import LogoutButton from './authTwo/components/LogoutButton';
import PetsModule from './pets/PetsModule';
import logo from './logo.svg';
import './App.css';
import { useAuthStore } from 'authTwo/store/auth.store';

const App: FC = () => {

  const { 
    initAuth, 
    log

   } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);


  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <nav className="main-nav">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/pets" className="nav-link">Mascotas</Link>
          </nav>
          {log ?  <LoginButton /> : <LogoutButton />}
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <div className="welcome">
                <h1>Bienvenido a la Veterinaria ICP</h1>
                {!log && <p>Por favor, inicia sesión para acceder a todas las funcionalidades.</p>}
              </div>
            } />
            
            <Route 
              path="/pets/*" 
              element={
                log ? 
                <PetsModule /> : 
                <Navigate to="/" replace />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 