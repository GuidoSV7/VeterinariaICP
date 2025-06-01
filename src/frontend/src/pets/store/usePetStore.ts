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
    deletePet: (id: string) => Promise<void>;
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
                    console.log("Store: Procesando imagen de", imageArray.length, "bytes");
                    
                    // Optimized conversion without size limits
                    const uint8Array = new Uint8Array(imageArray);
                    
                    // Use TextDecoder for better performance with large files (if available)
                    if (typeof TextDecoder !== 'undefined' && uint8Array.length > 100000) {
                        try {
                            // For very large images, this might be faster
                            const decoder = new TextDecoder('latin1');
                            const binaryString = decoder.decode(uint8Array);
                            imageBase64 = btoa(binaryString);
                        } catch (decoderError) {
                            // Fallback to manual conversion
                            console.log("TextDecoder failed, using manual conversion");
                            let binaryString = '';
                            for (let i = 0; i < uint8Array.length; i++) {
                                binaryString += String.fromCharCode(uint8Array[i]);
                            }
                            imageBase64 = btoa(binaryString);
                        }
                    } else {
                        // Standard conversion for smaller files
                        let binaryString = '';
                        for (let i = 0; i < uint8Array.length; i++) {
                            binaryString += String.fromCharCode(uint8Array[i]);
                        }
                        imageBase64 = btoa(binaryString);
                    }
                    
                    console.log("Store: Imagen convertida exitosamente");
                    console.log("Store: Tamaño original:", imageArray.length, "bytes");
                    console.log("Store: Tamaño en base64:", imageBase64.length, "caracteres");
                    console.log("Store: Ratio de compresión:", ((imageBase64.length / imageArray.length) * 100).toFixed(1) + "%");
                    
                } catch (error) {
                    console.error("Error convirtiendo imagen:", error);
                    throw new Error("Error al procesar la imagen: " + (error instanceof Error ? error.message : 'Error desconocido'));
                }
            }
            
            console.log("Store: Enviando datos al backend...");
            console.log("Store: Datos a enviar:", {
                name: pet.name,
                age: ageNumber,
                hasImage: !!imageBase64,
                imageSize: imageBase64.length
            });
            
            const result = await actor.registerPet(pet.name, ageNumber, imageBase64);
            
            console.log("Store: Respuesta del backend:", result);
            
            if (result.ok) {
                // Obtener la lista actualizada de mascotas
                await get().getAllPets();
                set({ selectedImage: null, isLoading: false, error: null });
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
            const rawPets = await actor.getAllPets();

            const pets = rawPets.map(([id, pet]: any) => ({
                id: id,
                name: pet.name,
                age: Number(pet.age),
                owner: pet.owner,
                image: pet.image
            }));


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
    },

    deletePet: async (id: string) => {
        const { actor } = useAuthStore.getState();
        
        set({ isLoading: true, error: null });
        
        try {
            if (!actor) {
                throw new Error("No hay actor disponible - Asegúrate de estar autenticado");
            }

            console.log("Store: Eliminando mascota en el índice:", id);
            const result = await actor.deletePet(id);
            
            if (result === "Mascota eliminada correctamente") {
                // Actualizar la lista de mascotas después de eliminar
                await get().getAllPets();
                set({ isLoading: false, error: null });
                console.log("Store: Mascota eliminada exitosamente");
            } else {
                throw new Error(result || "Error desconocido al eliminar mascota");
            }
        } catch (error) {
            console.error("Store: Error eliminando mascota:", error);
            set({ 
                isLoading: false, 
                error: error instanceof Error ? error.message : 'Error al eliminar la mascota'
            });
            throw error;
        }
    }
})));