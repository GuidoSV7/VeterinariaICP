import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStore } from '../store/usePetStore';
import useStore from '../../auth/store/auth.store';

const RegisterPet: React.FC = () => {
    const navigate = useNavigate();
    const { loading, error, registerPet, clearError, setError } = usePetStore();
    const { isAuthenticated } = useStore();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    // Limpiar errores al montar y desmontar
    useEffect(() => {
        clearError();
        return () => clearError();
    }, [clearError]);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validaciones
        if (!name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (!age.trim() || parseInt(age) < 0) {
            setError('La edad debe ser un número válido mayor o igual a 0');
            return;
        }

        try {
            await registerPet(name, parseInt(age));
            setName('');
            setAge('');
            // No necesitamos estado de éxito, usamos el navigate directamente
            navigate('/pets');
        } catch (err) {
            console.error('Error al registrar mascota:', err);
            // El error ya se maneja en el store
        }
    };

    if (!isAuthenticated) {
        return <div className="loading-message">Redirigiendo al inicio...</div>;
    }

    return (
        <div className="register-pet">
            <h2>Registrar Nueva Mascota</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="pet-form">
                <div className="form-group">
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            clearError(); // Limpiar error al escribir
                        }}
                        className="form-input"
                        disabled={loading}
                        placeholder="Ingresa el nombre de la mascota"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Edad:</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => {
                            setAge(e.target.value);
                            clearError(); // Limpiar error al escribir
                        }}
                        className="form-input"
                        disabled={loading}
                        placeholder="Ingresa la edad en años"
                        min="0"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !name.trim() || !age.trim()}
                    className="submit-button"
                >
                    {loading ? 'Registrando...' : 'Registrar Mascota'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPet; 