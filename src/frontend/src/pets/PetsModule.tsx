import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PetList from './components/PetList';
import RegisterPet from './components/RegisterPet';
import './styles/Pets.css';

const PetsModule: React.FC = () => {
    return (
        <div className="pets-module">
            <nav className="pets-nav">
                <Link to="/pets" className="nav-link">Lista de Mascotas</Link>
                <Link to="/pets/register" className="nav-link">Registrar Mascota</Link>
            </nav>

            <Routes>
                <Route path="/" element={<PetList />} />
                <Route path="/register" element={<RegisterPet />} />
            </Routes>
        </div>
    );
};

export default PetsModule; 