import React, { useEffect } from 'react';
import { usePetStore } from '../store/usePetStore';

const PetList: React.FC = () => {
    const { pets, isLoading, error, getAllPets, clearError } = usePetStore();

    useEffect(() => {
        getAllPets();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={clearError}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        <span className="text-red-500 hover:text-red-700">×</span>
                    </button>
                </div>
                <button 
                    onClick={() => getAllPets()}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
          {pets.length ? (
            <>
              <h2 className="font-black text-3xl text-center">Listado de Mascotas</h2>
              <p className="text-xl mt-5 mb-10 text-center">
                Administra tus {''}
                <span className="text-indigo-600 font-bold">Mascotikas</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pets.map((pet, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    {pet.image && (
                      <div className="w-full h-48 relative">
                        <img 
                          src={`data:image/jpeg;base64,${pet.image}`}
                          alt={`Foto de ${pet.name}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Error+al+cargar+imagen';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                      <p className="text-gray-600">
                        <span className="font-medium">Edad:</span> {pet.age.toString()} años
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
    );
};

export default PetList; 