import { create } from "zustand";

// Types
// States type
interface UserStoreStatesType {
  appIsFetchedUser: boolean;
  appUserId: string | null;
  appUserName: string | null;
  appUserEmail: string | null;
  appLabId: string | null;
  appLabName: string | null;
  appLabLocation: string | null;
  appIsOnlyScanMode: boolean;
}

// Actions type
interface SetAppUserParamsType {
  userId?: string;
  userName?: string;
  userEmail?: string;
  labId?: string;
  labName?: string;
  labLocation?: string;
}

interface UserStoreActionsType {
  setAppIsFetchedUser: (isFetched: boolean) => void;
  setAppIsOnlyScanMode: (isOnlyScan: boolean) => void;
  setAppUser: (params: SetAppUserParamsType) => void;
  removeAppUser: () => void;
}

// Constants
const DEFAULT_USER_STORE_STATES: UserStoreStatesType = {
  appIsFetchedUser: false,
  appUserId: null,
  appUserName: null,
  appUserEmail: null,
  appLabId: null,
  appLabName: null,
  appLabLocation: null,
  appIsOnlyScanMode: false,
};

// Define store
const useUserStore = create<UserStoreStatesType & UserStoreActionsType>()(
  (set) => {
    return {
      // States
      ...DEFAULT_USER_STORE_STATES,

      // Actions
      setAppIsFetchedUser: (isFetched) =>
        set(() => ({
          appIsFetchedUser: isFetched,
        })),
      setAppIsOnlyScanMode: (isOnlyScan) =>
        set(() => ({
          appIsOnlyScanMode: isOnlyScan,
        })),
      setAppUser: ({
        userId,
        userName,
        userEmail,
        labId,
        labName,
        labLocation,
      }) => {
        // Set user data
        set((state) => ({
          appUserId: userId ?? state.appUserId,
          appUserName: userName ?? state.appUserName,
          appUserEmail: userEmail ?? state.appUserEmail,
          appLabId: labId ?? state.appLabId,
          appLabName: labName ?? state.appLabName,
          appLabLocation: labLocation ?? state.appLabLocation,
        }));
      },
      removeAppUser: () => {
        // Reset user data
        set(() => ({
          ...DEFAULT_USER_STORE_STATES,
        }));
      },
    };
  }
);

export default useUserStore;
