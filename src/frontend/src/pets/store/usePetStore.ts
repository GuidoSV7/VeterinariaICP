import { create } from 'zustand';
import { Pet } from '../types/Pet';
import { backend } from '../../declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { devtools } from 'zustand/middleware';


type PetStore = {
    pets: Pet[];
    registerPet: (pet: Pet) => void;
    getAllPets: () => void;
    getPetsByOwner: (owner: string) => void;

}



export const usePetStore = create<PetStore>()(devtools((set, get) => ({
    pets: [],

    registerPet: (pet: Pet) => {
        backend.registerPet(pet.name, pet.age).then((result) => {
            
            set((state) => ({
                pets: [...state.pets, pet]
            }));
            
        })
    },

    getAllPets: async () => {
        const pets = await backend.getAllPets();
        set((state) => ({
                pets: [...state.pets]
        }));
    }


  
  
  

    
})));
