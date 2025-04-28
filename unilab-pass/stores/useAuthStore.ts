import { create } from "zustand";
import { devtools } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
// States type
interface AuthStoreStatesType {
  appIsLoggedIn: boolean;
  appToken: string | null;
  appIsTokenErr: boolean;
}

// Actions type
interface SetAppTokenParamsType {
  token: string | null;
}

interface AuthStoreActionsType {
  setAppIsLoggedIn: (isLoggedIn: boolean) => void;
  setAppToken: (params: SetAppTokenParamsType) => void;
  setAppIsTokenErr: (isTokenErr: boolean) => void;
  removeAppToken: () => void;
}

// Constants
const DEFAULT_AUTH_STORE_STATES: AuthStoreStatesType = {
  appIsLoggedIn: false,
  appToken: null,
  appIsTokenErr: false,
};

// Define store
const useAuthStore = create<AuthStoreStatesType & AuthStoreActionsType>()(
  devtools(
    // persist(
    (set) => ({
      // States
      ...DEFAULT_AUTH_STORE_STATES,

      // Methods
      setAppIsLoggedIn: (isLoggedIn: boolean) =>
        set(() => ({ appIsLoggedIn: isLoggedIn })),
      setAppToken: ({ token }) =>
        set(() => ({
          appToken: token,
        })),
      setAppIsTokenErr: (isTokenErr) =>
        set(() => ({ appIsTokenErr: isTokenErr })),
      removeAppToken: () => {
        set(() => ({
          appToken: null,
          appIsLoggedIn: false,
        }));
      },
    })
  )
);

export default useAuthStore;
