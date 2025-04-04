import { create } from "zustand";

// Types
// States type
interface RecordStoreStatesType {
  appRecordType: "CHECKIN" | "CHECKOUT" | null;
  appVisitorId: string | null;
  appVisitorName: string | null;
  appVisitorEmail: string | null;
  appRecordImg: string | null;
  appFailTime: number | null;
}

// Actions type
interface SetAppRecordParamsType {
  recordType?: "CHECKIN" | "CHECKOUT";
  visitorId?: string;
  visitorName?: string;
  visitorEmail?: string;
  recordImg?: string;
  failTime?: number;
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
  appFailTime: 0,
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
        failTime,
      }) => {
        // Set user data
        set((state) => ({
          appRecordType: recordType ?? state.appRecordType,
          appVisitorId: visitorId ?? state.appVisitorId,
          appVisitorName: visitorName ?? state.appVisitorName,
          appVisitorEmail: visitorEmail ?? state.appVisitorEmail,
          appRecordImg: recordImg ?? state.appRecordImg,
          appFailTime: failTime ?? state.appFailTime,
        }));
      },
      removeAppRecord: () => {
        // Reset user data
        set(() => ({
          ...DEFAULT_RECORD_STORE_STATES,
        }));
      },
    };
  }
);

export default useRecordStore;
