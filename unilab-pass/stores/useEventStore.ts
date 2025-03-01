import { create } from "zustand";

// Types
// States type
interface EventStoreStatesType {
  appIsEvent: boolean;
  appEventId: string | null;
  appEventName: string | null;
}

// Actions type
interface SetAppEventParamsType {
  eventId?: string;
  eventName?: string;
}

interface EventStoreActionsType {
  setAppIsEvent: (isEvent: boolean) => void;
  setAppEvent: (params: SetAppEventParamsType) => void;
  removeAppEvent: () => void;
}

// Constants
const DEFAULT_EVENT_STORE_STATES: EventStoreStatesType = {
  appIsEvent: false,
  appEventId: null,
  appEventName: null,
};

// Define store
const useEventStore = create<EventStoreStatesType & EventStoreActionsType>()(
  (set) => {
    return {
      // States
      ...DEFAULT_EVENT_STORE_STATES,

      // Actions
      setAppIsEvent: (isEvent) =>
        set(() => ({
          appIsEvent: isEvent,
        })),
      setAppEvent: ({ eventId, eventName }) => {
        // Set event data
        set((state) => ({
          appEventId: eventId ?? state.appEventId,
          appEventName: eventName ?? state.appEventName,
        }));
      },
      removeAppEvent: () => {
        // Reset Event data
        set(() => ({
          ...DEFAULT_EVENT_STORE_STATES,
        }));
      },
    };
  }
);

export default useEventStore;
