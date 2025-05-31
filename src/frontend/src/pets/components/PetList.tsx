import React, { useEffect } from 'react';
import { usePetStore } from '../store/usePetStore';

const PetList: React.FC = () => {
    const { pets } = usePetStore();

   

    return (
        <div className="pet-list">
            <h2 className="">Lista de Mascotas</h2>
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