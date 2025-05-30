import React, { useEffect } from 'react';
import { usePetStore } from '../store/usePetStore';

const PetList: React.FC = () => {
    const { pets, loading, error, fetchPets } = usePetStore();

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    if (loading) return <div>Cargando mascotas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="pet-list">
            <h2>Lista de Mascotas</h2>
            <div className="pets-grid">
                {pets.map((pet, index) => (
                    <div key={index} className="pet-card">
                        <h3>{pet.name}</h3>
                        <p>Edad: {pet.age.toString()} años</p>
                        <p>Dueño: {pet.owner.toString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PetList; 