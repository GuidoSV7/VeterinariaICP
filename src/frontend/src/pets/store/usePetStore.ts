import { create } from 'zustand';
import { Pet } from '../types/Pet';
import { backend } from '../../declarations/backend';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, Identity } from '@dfinity/agent';

type Result = {
    'ok': string;
    'err': string;
    'notFound': null;
    'unauthorized': null;
};

interface PetStore {
    pets: Pet[];
    loading: boolean;
    error: string | null;
    // Actions
    setPets: (pets: Pet[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    fetchPets: () => Promise<void>;
    fetchMyPets: () => Promise<void>;
    registerPet: (name: string, age: number) => Promise<void>;
    clearError: () => void;
}

type State = {
    set: (partial: Partial<PetStore> | ((state: PetStore) => Partial<PetStore>)) => void;
    get: () => PetStore;
};

export const usePetStore = create<PetStore>((set: State['set'], get: State['get']) => ({
    pets: [],
    loading: false,
    error: null,

    setPets: (pets) => set({ pets }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchPets: async () => {
        const { setLoading, setPets, setError } = get();
        try {
            setLoading(true);
            setError(null);
            const result = await backend.getAllPets();
            setPets(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al cargar las mascotas');
            console.error('Error fetching pets:', error);
        } finally {
            setLoading(false);
        }
    },

    fetchMyPets: async () => {
        try {
            set({ loading: true, error: null });
            const authClient = await AuthClient.create();
            const identity = await authClient.getIdentity();
            const principal = identity.getPrincipal();
            const pets = await backend.getPetsByOwner(principal);
            set({ pets, loading: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Error al cargar tus mascotas',
                loading: false 
            });
        }
    },

    registerPet: async (name: string, age: number) => {
        const { setLoading, setError, fetchPets } = get();
        try {
            setLoading(true);
            setError(null);

            const result = await backend.registerPet(name, BigInt(age));
            
            if ('ok' in result) {
                await fetchPets();
            } else if ('err' in result) {
                throw new Error(result.err);
            } else if ('unauthorized' in result) {
                throw new Error('No estás autorizado para realizar esta acción');
            } else {
                throw new Error('No se pudo registrar la mascota');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al registrar la mascota');
            console.error('Error registering pet:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    },

    clearError: () => set({ error: null })
})); 