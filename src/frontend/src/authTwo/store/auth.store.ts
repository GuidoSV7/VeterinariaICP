
import { create } from 'zustand';
import { devtools, persist } from "zustand/middleware";

import { canisterId, createActor } from '../../declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';


type AuthStore = {
  log: Boolean;
  authClient : AuthClient | null;
  actor: any | null;
  initAuth: () => Promise<void>;
  handleAuthenticated: (authClient: AuthClient) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  
}

const enviroment = 'local' === 'local'
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

    const actor = createActor(process.env.REACT_APP_CANISTER_ID_BACKEND || '', {
      agent,
    })
    
    set((state) => ({
      log: true,
      authClient,
      actor
    }))

  },

  login : async () => {
    console.log('🚀 Login attempt:');
    console.log('- Environment:', enviroment);
    const authClient = await AuthClient.create();
    await authClient.login({
      maxTimeToLive: BigInt(7 * 24 * 60 * 1000 * 1000 * 1000),
      
      identityProvider: enviroment ? `http://${process.env.REACT_APP_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/` : 'https://identity.ic0.app',
      onSuccess: () => {
        const { handleAuthenticated } = get();
        handleAuthenticated(authClient);
        console.log(authClient.getIdentity().getPrincipal().toText());

            set((state) => ({
              log: true
 
            }))

      }
    })
  }

  ,

  logout: async () => {
    const { authClient } = get();
    if (authClient) {
      await authClient.logout();
    }
        
    set((state) => ({
      log: false
 
    }))
  }


    
})));
