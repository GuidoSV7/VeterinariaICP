import { create } from 'zustand';
import { Pet } from '../types/Pet';
import { devtools } from 'zustand/middleware';
import { useAuthStore } from 'auth/store/auth.store';
import { fileToCanisterBinaryStoreFormat } from "../utils/image";

type PetStore = {
    pets: Pet[];
    selectedImage: File | null;
    isLoading: boolean;
    error: string | null;
    registerPet: (pet: Pet) => Promise<void>;
    getAllPets: () => Promise<void>;
    getPetsByOwner: (owner: string) => Promise<void>;
    handleImageDrop: (file: File) => void;
    clearError: () => void;
}

export const usePetStore = create<PetStore>()(devtools((set, get) => ({
    pets: [],
    selectedImage: null,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    handleImageDrop: (file: File) => {
        set({ selectedImage: file });
    },

    registerPet: async (pet: Pet) => {
        const { actor } = useAuthStore.getState();
        
        set({ isLoading: true, error: null });
        
        try {
            console.log("Store: Iniciando registro de mascota...");
            console.log("Store: Actor disponible:", !!actor);
            
            if (!actor) {
                throw new Error("No hay actor disponible - Asegúrate de estar autenticado");
            }

            // Convertir la edad a número para el backend
            const ageNumber = Number(pet.age);
            
            // Convertir la imagen a base64 si existe
            let imageBase64 = "";
            if (pet.image) {
                try {
                    const imageArray = JSON.parse(pet.image);
                    
                    // Convertir array a base64 en chunks
                    const chunkSize = 8192; // Procesar en chunks de 8KB
                    let binary = '';
                    
                    for (let i = 0; i < imageArray.length; i += chunkSize) {
                        const chunk = imageArray.slice(i, i + chunkSize);
                        binary += String.fromCharCode.apply(null, chunk);
                    }
                    
                    imageBase64 = btoa(binary);
                    
                    console.log("Store: Imagen convertida exitosamente");
                    console.log("Store: Tamaño de la imagen en base64:", imageBase64.length);
                } catch (error) {
                    console.error("Error convirtiendo imagen:", error);
                    throw new Error("Error al procesar la imagen: " + (error instanceof Error ? error.message : 'Error desconocido'));
                }
            }

            console.log("Store: Enviando datos al backend...");
            console.log("Store: Datos a enviar:", {
                name: pet.name,
                age: ageNumber,
                imageSize: imageBase64.length
            });

            const result = await actor.registerPet(pet.name, ageNumber, imageBase64);
            
            console.log("Store: Respuesta del backend:", result);

            if (result.ok) {
                set((state) => ({
                    pets: [...state.pets, {...pet, image: imageBase64}],
                    selectedImage: null,
                    isLoading: false,
                    error: null
                }));
                console.log("Store: Mascota registrada exitosamente");
            } else {
                throw new Error(result.err || "Error desconocido al registrar mascota");
            }
        } catch (error) {
            console.error("Store: Error registrando mascota:", error);
            set({ 
                isLoading: false, 
                error: error instanceof Error ? error.message : 'Error desconocido al registrar mascota'
            });
            throw error;
        }
    },

    getAllPets: async () => {
        const { actor } = useAuthStore.getState();
        
        set({ isLoading: true, error: null });
        
        try {
            if (!actor) {
                throw new Error("No hay actor disponible - Asegúrate de estar autenticado");
            }

            console.log("Store: Obteniendo todas las mascotas...");
            const pets = await actor.getAllPets();
            console.log("Store: Mascotas obtenidas:", pets);
            
            set({ pets, isLoading: false, error: null });
        } catch (error) {
            console.error("Store: Error obteniendo mascotas:", error);
            set({ 
                isLoading: false, 
                error: error instanceof Error ? error.message : 'Error al obtener las mascotas'
            });
        }
    },

    getPetsByOwner: async (owner: string) => {
        const { actor } = useAuthStore.getState();
        
        set({ isLoading: true, error: null });
        
        try {
            if (!actor) {
                throw new Error("No hay actor disponible - Asegúrate de estar autenticado");
            }

            console.log("Store: Obteniendo mascotas del dueño:", owner);
            const pets = await actor.getPetsByOwner(owner);
            console.log("Store: Mascotas obtenidas:", pets);
            
            set({ pets, isLoading: false, error: null });
        } catch (error) {
            console.error("Store: Error obteniendo mascotas del dueño:", error);
            set({ 
                isLoading: false, 
                error: error instanceof Error ? error.message : 'Error al obtener las mascotas'
            });
        }
    }
})));