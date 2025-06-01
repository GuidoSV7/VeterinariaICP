import { create } from 'zustand';
import { Pet } from '../types/Pet';
import { backend } from '../../declarations/backend';

import { devtools } from 'zustand/middleware';
import { useAuthStore } from 'authTwo/store/auth.store';


type PetStore = {
    pets: Pet[];
    registerPet: (pet: Pet) => void;
    getAllPets: () => void;
    getPetsByOwner: (owner: string) => void;

}



export const usePetStore = create<PetStore>()(devtools((set, get) => ({
    pets: [],

    registerPet: async (pet: Pet) => {
        const { actor } = useAuthStore.getState();
        console.log('Backend:', backend);
       await actor.registerPet(pet.name, pet.age).then(() => {
            
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
