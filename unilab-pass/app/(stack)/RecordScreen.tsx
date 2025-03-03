// Core
import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  IconButton,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import dayjs from "dayjs";

// App
import { useAuthStore, useUserStore } from "stores";
import useBackHandler from "utils/useBackHandler";
import { getFullName } from "lib/utils";
import {
  EventLogControllerApi,
  EventLogControllerApiAddEventLogRequest,
  LogControllerApi,
  LogControllerApiCreateNewLogRequest,
} from "api/index";
import { InfoDialog } from "components/CustomDialog";
import useEventStore from "stores/useEventStore";

// Types
type Props = {};

// Component
const RecordScreen = (props: Props) => {
  // States
  const [isPendingPostRecord, setIsPendingPostRecord] =
    useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isInfoDialog, setIsInfoDialog] = useState<boolean>(false);

  // Params
  const { firstName, lastName, email, id, recordType } = useLocalSearchParams();

  // Router
  const router = useRouter();

  // Server
  const logControllerApi = new LogControllerApi();
  const eventLogControllerApi = new EventLogControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabName, appLabId } = useUserStore();
  const { appIsEvent, appEventName, appEventId } = useEventStore();

  // Methods
  // handle back
  useBackHandler(() => {
    router.replace("/(tabs)/RecordActivityScreen");
    return true;
  });

  // Handle post new record
  const handleRecord = async () => {
    if (isPendingPostRecord) return;
    setIsPendingPostRecord(true);

    // If is event, create event record
    if (appIsEvent) {
      try {
        const param: EventLogControllerApiAddEventLogRequest = {
          request: {
            eventId: appEventId ?? "",
            guestId: id as string,
            recordType: recordType === "CHECKIN" ? "CHECKIN" : "CHECKOUT",
            photoURL: "",
          },
        };
        console.log("request:", param);
        const response = await eventLogControllerApi.addEventLog(param, {
          headers: { Authorization: `Bearer ${appToken}` },
        });
        console.log("Successful record event:", response.data.result);
        setIsInfoDialog(true);
        setAlertMessage("Record activity successfully");
      } catch (error: any) {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
      setIsPendingPostRecord(false);
      return;
    }

    // Normal record
    try {
      const param: LogControllerApiCreateNewLogRequest = {
        logCreationRequest: {
          labId: appLabId ?? "",
          userId: id as string,
          recordType: recordType === "CHECKIN" ? "CHECKIN" : "CHECKOUT",
          photoURL: "",
        },
      };
      await logControllerApi.createNewLog(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });

      setAlertMessage("Record activity successfully");
      setIsInfoDialog(true);
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsAlert(true);
    }
    setIsPendingPostRecord(false);
  };

  // Template
  return (
    <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
      {/* Header */}
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          top: 0,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FCFCFC",
          width: "100%",
          paddingVertical: 20,
        }}
      >
        {/* Go back button */}
        <IconButton
          icon={"chevron-left"}
          style={{ position: "absolute", left: 10, zIndex: 10 }}
          size={32}
          iconColor="#808080"
          onPress={() => router.replace("/(tabs)/RecordActivityScreen")}
        />
        {/* Title */}
        <Text
          variant="titleLarge"
          style={{
            fontFamily: "Poppins-SemiBold",
            color: "#333",
            textAlign: "center",
            flex: 1,
            alignItems: "center",
          }}
        >
          Record Activity
        </Text>
      </View>

      <ScrollView>
        {/* Content */}
        <View style={styles.container}>
          {/* Information */}
          <View style={styles.infoContainer}>
            <Text
              variant="titleMedium"
              style={{
                fontFamily: "Poppins-SemiBold",
                alignSelf: "flex-start",
              }}
            >
              Member information
            </Text>

            {/* Name */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              value={
                firstName
                  ? getFullName({
                      firstName: firstName as string,
                      lastName: lastName as string,
                    })
                  : "Not found"
              }
              label="Full Name"
            />

            {/* ID */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={id as string}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="Id"
            />

            {/* Email */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={(email as string) ?? "Not found"}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="Email"
            />
          </View>

          {/* Time */}
          <View style={styles.timeContainer}>
            <Text
              variant="titleMedium"
              style={{
                fontFamily: "Poppins-SemiBold",
                alignSelf: "flex-start",
              }}
            >
              Location & Type
            </Text>

            {/* Lab */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={appLabName ?? ""}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="Lab Name"
            />

            {/* Type */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={recordType as string}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
                textTransform: "capitalize",
              }}
              label="Record Type"
            />

            {/* Is Event */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={appIsEvent ? appEventName ?? "None" : "None"}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
                textTransform: "capitalize",
              }}
              label="Event"
            />
          </View>

          {/* Action Button */}
          <Button
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            mode="contained"
            style={styles.actButton}
            onPress={handleRecord}
            loading={isPendingPostRecord}
          >
            Record
          </Button>
        </View>
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={isAlert}
        onDismiss={() => setIsAlert(false)}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => setIsAlert(false),
        }}
      >
        {alertMessage}
      </Snackbar>

      {/* Alert Dialog */}
      <InfoDialog
        title={alertMessage}
        visible={isInfoDialog}
        setVisible={setIsInfoDialog}
        onCloseDialog={() => router.replace("/(tabs)/RecordActivityScreen")}
      />
    </View>
  );
};

export default RecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 15,
    paddingBottom: 30,
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    gap: 10,
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
    width: 300,
    gap: 10,
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "transparent",
  },
  time: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  actButton: {
    marginTop: 50,
    borderRadius: 5,
    minWidth: 300,
    minHeight: 40,
  },
});
