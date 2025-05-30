import { create } from 'zustand';
import { createActor } from '../../../..//declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from '../../../..//declarations/backend/backend.did';

interface State {
  isAuthenticated: boolean;
  identity: Identity | null;
  names: string[];
  name: string;
  backend: ActorSubclass<_SERVICE> | null;
  authClient: AuthClient | null;
}

interface Actions {
  initAuth: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setName: (name: string) => void;
  addName: () => Promise<void>;
  getNames: () => Promise<void>;
}

type Store = State & Actions;

const BACKEND_CANISTER_ID = "uxrrr-q7777-77774-qaaaq-cai";

const useStore = create<Store>((set, get) => ({
  isAuthenticated: false,
  identity: null,
  names: [],
  name: "",
  backend: null,
  authClient: null,

  initAuth: async () => {
    try {
      const authClient = await AuthClient.create();
      set({ authClient });

      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        const backend = createActor(BACKEND_CANISTER_ID, {
          agentOptions: {
            identity,
            host: "http://127.0.0.1:4943",
          },
        });
        
        set({ 
          identity, 
          isAuthenticated: true,
          backend 
        });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  },

  login: async () => {
    const { authClient } = get();
    if (!authClient) {
      console.error("Auth client not initialized");
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider: 'http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/',
          onSuccess: () => {
            const identity = authClient.getIdentity();
            const backend = createActor(BACKEND_CANISTER_ID, {
              agentOptions: {
                identity,
                host: "http://127.0.0.1:4943",
              },
            });
            
            set({ 
              identity, 
              isAuthenticated: true,
              backend 
            });
            resolve();
          },
          onError: (error) => {
            console.error("Login error:", error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error("Failed to login:", error);
    }
  },

  logout: async () => {
    const { authClient } = get();
    if (!authClient) {
      console.error("Auth client not initialized");
      return;
    }

    try {
      await authClient.logout();
      set({ 
        identity: null, 
        isAuthenticated: false,
        backend: null 
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  setName: (name: string) => set({ name }),

  addName: async () => {
    const { backend, name, getNames } = get();
    if (!name) {
      alert("Please provide a name.");
      return;
    }
    
    try {
      if (!backend) throw new Error("Backend not initialized");
      
      const result = await backend.addName(name);
      if ("ok" in result) {
        await getNames();
        set({ name: "" });
      }
    } catch (err) {
      console.error(err);
    }
  },

  getNames: async () => {
    const { backend } = get();
    try {
      if (!backend) throw new Error("Backend not initialized");
      
      const result = await backend.getNames();
      if ("ok" in result) {
        set({ names: result.ok });
      }
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useStore; 