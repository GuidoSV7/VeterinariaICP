
import { create } from 'zustand';
import { devtools, persist } from "zustand/middleware";

import { canisterId, createActor } from '../../../../declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';


type AuthStore = {
  log: Boolean;
  authClient : AuthClient | null;
  actor: any | null;
  initAuth: () => Promise<void>;
  handleAuthenticated: (authClient: AuthClient) => void;
  
}

const enviroment = process.env.DFX_NETWORK === 'local'
const localhost = "http://localhost:4943"
const productionHost = "https://ic0.app"




export const useAuthStore = create<AuthStore>()(devtools((set, get) => ({
  log: false,
  authClient: null,
  actor: null,

  
  
  initAuth: async () => { 
    const authClient = await AuthClient.create();
    const { handleAuthenticated } = get(); 

    if(await authClient.isAuthenticated()) {
      handleAuthenticated(authClient);
    }else {

      set((state) => ({
        authClient
        
      }))
    }
  },

  handleAuthenticated: async (authClient: AuthClient) => {

    const identity = authClient.getIdentity();
    const agent = new HttpAgent({
      identity,
      host: enviroment? localhost : productionHost,
    })

    const actor = createActor(canisterId, {
      agent,
    })
    
    set((state) => ({
      log: true,
      authClient,
      actor
    }))

  },

  Logout: async () => {
    const { authClient } = get();
    if (authClient) {
      await authClient.logout();
    }
        
    set((state) => ({
      log: false
 
    }))
  }


    
})));
