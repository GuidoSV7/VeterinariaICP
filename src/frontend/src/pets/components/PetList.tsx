import React, { useEffect } from 'react';
import { usePetStore } from '../store/usePetStore';

const PetList: React.FC = () => {
    const { pets } = usePetStore();

   

    return (
        <div className="w-full overflow-y-scroll">
          {pets.length ? (
            <>
              <h2 className="font-black text-3xl text-center">Listado de Mascotas</h2>
              <p className="text-xl mt-5 mb-10 text-center">
                Administra tus {''}
                <span className="text-indigo-600 font-bold">Mascotikas</span>
              </p>
              {pets.map(pet => (
                <h2>{pet.name}</h2>
                
              ))}
            </>
          ) : (
            <>
              <h2 className="font-black text-3xl text-center">No hay Mascotas</h2>
              <p className="text-xl mt-5 mb-10 text-center">
                Comienza agregando tus mascotas {''}
                <span className="text-indigo-600 font-bold">Y aparecerán en este lugar</span>
              </p>
    
            </>
          )}
          
        </div>
      )
};

export default PetList; 