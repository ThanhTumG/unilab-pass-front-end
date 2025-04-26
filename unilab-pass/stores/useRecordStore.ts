import { create } from "zustand";

// Types
// States type
interface RecordStoreStatesType {
  appRecordType: "CHECKIN" | "CHECKOUT" | null;
  appVisitorId: string | null;
  appVisitorName: string | null;
  appVisitorEmail: string | null;
  appRecordImg: string | null;
}

// Actions type
interface SetAppRecordParamsType {
  recordType?: "CHECKIN" | "CHECKOUT";
  visitorId?: string;
  visitorName?: string;
  visitorEmail?: string;
  recordImg?: string;
}

interface RecordStoreActionsType {
  setAppRecord: (params: SetAppRecordParamsType) => void;
  removeAppRecord: () => void;
}

// Constants
const DEFAULT_RECORD_STORE_STATES: RecordStoreStatesType = {
  appRecordType: null,
  appVisitorId: null,
  appVisitorName: null,
  appVisitorEmail: null,
  appRecordImg: null,
};

// Define store
const useRecordStore = create<RecordStoreStatesType & RecordStoreActionsType>()(
  (set) => {
    return {
      // States
      ...DEFAULT_RECORD_STORE_STATES,

      // Actions
      setAppRecord: ({
        recordType,
        visitorId,
        visitorName,
        visitorEmail,
        recordImg,
      }) => {
        // Set user data
        set((state) => ({
          appRecordType: recordType ?? state.appRecordType,
          appVisitorId: visitorId ?? state.appVisitorId,
          appVisitorName: visitorName ?? state.appVisitorName,
          appVisitorEmail: visitorEmail ?? state.appVisitorEmail,
          appRecordImg: recordImg ?? state.appRecordImg,
        }));
      },
      removeAppRecord: () => {
        // Reset record data
        set(() => ({
          ...DEFAULT_RECORD_STORE_STATES,
        }));
      },
    };
  }
);

export default useRecordStore;
