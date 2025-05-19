// Core
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Snackbar, Text, useTheme } from "react-native-paper";

// App
import EventItem from "components/EventItem";
import EmptyIcon from "components/ui/EmptyIcon";
import useEventStore from "stores/useEventStore";
import ScreenHeader from "components/ScreenHeader";
import { useAuthStore, useUserStore } from "stores";
import { WarningDialog } from "components/CustomDialog";
import { EventControllerApi, LabEventRespond } from "api/index";

// Types
type Props = {};

// Component
const EventViewScreen = (props: Props) => {
  // States
  const [isLoading, setIsLoading] = useState({
    getCurrentEvent: false,
    getAllEvent: false,
    deleteEvent: false,
  });
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [eventList, setEventList] = useState<LabEventRespond[]>([]);
  const [isWarnDialog, setIsWarnDialog] = useState<boolean>(false);
  const [deleteEventId, setDeleteEventId] = useState<string>("");

  // Theme
  const theme = useTheme();

  // Store
  const { appLabId } = useUserStore();
  const {
    setAppEvent,
    setAppIsEvent,
    appEventId,
    appEventName,
    appEventStartTime,
    appEventEndTime,
    appIsEvent,
    appIsFetchedEvent,
    setAppIsFetchedEvent,
    removeAppEvent,
  } = useEventStore();

  // Server
  const eventControllerApi = new EventControllerApi();

  // Router
  const router = useRouter();

  // Methods
  // Handle get current event
  const handleGetCurrentEv = useCallback(async () => {
    if (isLoading.getCurrentEvent) return;
    setIsLoading((prev) => ({ ...prev, getCurrentEvent: true }));
    try {
      const { appToken } = useAuthStore.getState();
      const response = await eventControllerApi.getCurrentEvent(
        { labId: appLabId ?? "" },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );
      const event = response.data.result;
      console.log("Success get current event", event?.id);
      if (event?.id) {
        setAppIsEvent(true);
        setAppEvent({
          eventId: event.id,
          eventName: event.name,
          startTime: event.startTime,
          endTime: event.endTime,
        });
      }
    } catch (error: any) {
      if (error.response) {
        setAlertMessage("Failed to get the current event");
        setIsSnackBarVisible(true);
      }
    }
    setIsLoading((prev) => ({ ...prev, getCurrentEvent: false }));
  }, []);

  // Handle get all events
  const handleGetEvList = useCallback(async () => {
    if (isLoading.getAllEvent) return;
    setIsLoading((prev) => ({ ...prev, getAllEvent: true }));
    try {
      const { appToken } = useAuthStore.getState();
      const response = await eventControllerApi.getEvents(
        { labId: appLabId ?? "" },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );
      console.log("Success get all event");
      const event = response.data.result ?? [];
      setEventList(event);
    } catch (error: any) {
      if (error.response) {
        setAlertMessage("Failed to get event list");
        setIsSnackBarVisible(true);
      }
    }
    setIsLoading((prev) => ({ ...prev, getAllEvent: false }));
  }, []);

  // Handle delete event
  const handleDeleteEv = async () => {
    if (isLoading.deleteEvent) return;
    setIsLoading((prev) => ({ ...prev, deleteEvent: true }));
    const { appToken } = useAuthStore.getState();
    try {
      await eventControllerApi.deleteEvent(
        { eventId: deleteEventId },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );
      if (appEventId === deleteEventId) {
        removeAppEvent();
        setAppIsEvent(false);
      }
      setIsWarnDialog(false);
      onRefresh();
    } catch (error: any) {
      if (error.response) {
        setAlertMessage(error.response.data.message);
        setIsSnackBarVisible(true);
      }
    }
    setIsLoading((prev) => ({ ...prev, deleteEvent: false }));
  };

  // Handle set delete event
  const handleSetDeletedEv = (id: string) => {
    setDeleteEventId(id);
    setIsWarnDialog(true);
  };

  // Handle create new event
  const handleCreateEv = () => {
    router.push("/CreateEventScreen");
  };

  // Handle view detail event
  const handleViewDetailEv = (event: LabEventRespond) => {
    router.push({
      pathname: "/DetailEventScreen",
      params: {
        eventId: event.id,
        eventName: event.name,
        startTime: event.startTime,
        endTime: event.endTime,
      },
    });
  };

  // Handle refresh
  const onRefresh = useCallback(() => {
    console.log("Refreshing...");
    handleGetCurrentEv();
    handleGetEvList();
  }, [handleGetEvList, handleGetCurrentEv]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      if (!appIsFetchedEvent) {
        console.log(appIsFetchedEvent);
        handleGetCurrentEv();
        setAppIsFetchedEvent(true);
      }
      handleGetEvList();
    }, [appIsFetchedEvent])
  );

  // Template
  return (
    <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
      {/* Header */}
      <ScreenHeader title="Manage Event" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={Object.values(isLoading).some(
              (value) => value === true
            )}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.container}>
          {/* Current Event */}
          <View style={{ gap: 12 }}>
            <Text variant="titleMedium" style={styles.title}>
              Current Event
            </Text>
            {appIsEvent ||
            (appIsEvent &&
              !isLoading.getAllEvent &&
              !isLoading.getCurrentEvent) ? (
              <Card elevation={2} style={styles.card}>
                <Card.Content
                  style={{
                    backgroundColor: "rgba(230, 240, 255, 0.35)",
                    borderRadius: 12,
                  }}
                >
                  <Text variant="titleMedium" style={styles.eventTitle}>
                    {appEventName}
                  </Text>
                  <View style={styles.timeContainer}>
                    <Text variant="bodyMedium" style={styles.timeText}>
                      Start:{" "}
                      {dayjs(appEventStartTime).format("DD MMM YYYY - HH:mm")}
                    </Text>
                    <Text variant="bodyMedium" style={styles.timeText}>
                      End:{" "}
                      {dayjs(appEventEndTime).format("DD MMM YYYY - HH:mm")}
                    </Text>
                  </View>

                  {/* Action */}
                  <View style={styles.actions}>
                    <Button
                      mode="contained"
                      onPress={() =>
                        handleViewDetailEv({
                          id: appEventId ?? "",
                          name: appEventName ?? "",
                          startTime: appEventStartTime ?? "",
                          endTime: appEventEndTime ?? "",
                        })
                      }
                      style={styles.button}
                      labelStyle={styles.buttonLabel}
                      icon={"file-document"}
                    >
                      View Log
                    </Button>
                    <Button
                      mode="outlined"
                      rippleColor={"transparent"}
                      onPress={() => handleSetDeletedEv(appEventId ?? "")}
                      style={styles.deleteButton}
                      labelStyle={styles.deleteButtonLabel}
                      icon={"delete-outline"}
                    >
                      Delete
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ) : (
              <View>
                <Text
                  variant="bodyMedium"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  There is no event now
                </Text>
              </View>
            )}
          </View>

          {/* Event List */}
          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text variant="titleMedium" style={styles.title}>
                Your Events
              </Text>

              {/* Add event */}
              <Button
                mode="text"
                labelStyle={{ fontFamily: "Poppins-Medium" }}
                onPress={handleCreateEv}
              >
                Add event
              </Button>
            </View>

            {/* Event list */}
            <View style={{ gap: 10, paddingHorizontal: 10 }}>
              {eventList.length !== 0 &&
                !isLoading.getAllEvent &&
                !isLoading.getCurrentEvent &&
                eventList.map((e) => (
                  <EventItem
                    key={e.id}
                    eventName={e.name ?? "Not Found"}
                    startTime={e.startTime ?? "Not Found"}
                    endTime={e.endTime ?? "Not Found"}
                    onViewLog={() => handleViewDetailEv(e)}
                    onDelete={() => handleSetDeletedEv(e.id ?? "")}
                  />
                ))}
              {eventList.length === 0 &&
                !isLoading.getAllEvent &&
                !isLoading.getCurrentEvent && <EmptyIcon />}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Alert Dialog */}
      <WarningDialog
        title="Warning"
        content="Are you sure you want to delete this event?"
        visible={isWarnDialog}
        setVisible={setIsWarnDialog}
        onConfirm={handleDeleteEv}
      />

      {/* Snackbar */}
      <Snackbar
        visible={isSnackBarVisible}
        onDismiss={() => setIsSnackBarVisible(false)}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => setIsSnackBarVisible(false),
        }}
      >
        {alertMessage}
      </Snackbar>
    </View>
  );
};

export default EventViewScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 32,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
  },
  scrollView: {
    marginTop: 80,
  },
  card: {
    marginHorizontal: 10,
    borderRadius: 12,
  },
  eventTitle: {
    color: "#333",
    fontFamily: "Poppins-Medium",
  },
  timeContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  timeText: {
    color: "#4a4a4a",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    marginRight: 8,
    borderRadius: 8,
  },
  deleteButton: {
    borderColor: "#d32f2f",
    borderRadius: 8,
  },
  buttonLabel: {
    fontFamily: "Poppins-Medium",
    color: "#fff",
    fontSize: 14,
  },
  deleteButtonLabel: {
    fontFamily: "Poppins-Medium",
    color: "#d32f2f",
    fontSize: 14,
  },
});
