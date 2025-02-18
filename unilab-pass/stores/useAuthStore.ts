import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
// States type
interface AuthStoreStatesType {
  appIsLoggedIn: boolean;
  appToken: string | null;
}

// Actions type
interface SetAppTokenParamsType {
  token: string | null;
}

interface AuthStoreActionsType {
  setAppIsLoggedIn: (isLoggedIn: boolean) => void;
  setAppToken: (params: SetAppTokenParamsType) => void;
  removeAppToken: () => void;
}

// Constants
const DEFAULT_AUTH_STORE_STATES: AuthStoreStatesType = {
  appIsLoggedIn: false,
  appToken: null,
};

// Define store
const useAuthStore = create<AuthStoreStatesType & AuthStoreActionsType>()(
  devtools(
    persist(
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
        removeAppToken: () => {
          set(() => ({
            appToken: null,
          }));
        },
      }),
      {
        name: "app-auth-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

export default useAuthStore;
