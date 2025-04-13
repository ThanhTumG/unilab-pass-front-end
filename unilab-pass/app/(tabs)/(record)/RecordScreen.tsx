// Core
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";

// App
import { getFullName } from "lib/utils";
import useEventStore from "stores/useEventStore";
import { useAuthStore, useUserStore } from "stores";
import { SuccessDialog } from "components/CustomDialog";
import {
  EventLogControllerApi,
  EventLogControllerApiAddEventLogRequest,
  LogControllerApi,
  LogControllerApiCreateNewLogRequest,
} from "api/index";
import ScreenHeader from "components/ScreenHeader";
import useRecordStore from "stores/useRecordStore";
import useBackHandler from "utils/useBackHandler";

// Types
type Props = {};

// Component
const RecordScreen = (props: Props) => {
  // States
  const [isPendingPostRecord, setIsPendingPostRecord] =
    useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isSuccessDialog, setIsSuccessDialog] = useState<boolean>(false);

  // Params

  // Router
  const router = useRouter();

  // Server
  const logControllerApi = new LogControllerApi();
  const eventLogControllerApi = new EventLogControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabName, appLabId } = useUserStore();
  const { appIsEvent, appEventName, appEventId } = useEventStore();
  const {
    appRecordType,
    appVisitorId,
    appVisitorEmail,
    appVisitorName,
    appRecordImg,
    removeAppRecord,
  } = useRecordStore();

  // Methods
  // Handle back
  useBackHandler(() => {
    router.dismissAll();
    return true;
  });

  // Handle post new record
  const handleRecord = async () => {
    if (isPendingPostRecord) return;
    setIsPendingPostRecord(true);

    // If is event, create event record
    if (appIsEvent) {
      try {
        const file = {
          uri: appRecordImg,
          type: "image/jpeg",
          name: `${appVisitorId}_event_record_photo.jpg`,
        };
        const param: EventLogControllerApiAddEventLogRequest = {
          request: {
            eventId: appEventId ?? "",
            guestId: appVisitorId ?? "",
            recordType: appRecordType ?? undefined,
          },
          file: file,
        };
        console.log(param.request);
        await eventLogControllerApi.addEventLog(param, {
          headers: { Authorization: `Bearer ${appToken}` },
        });
        setIsSuccessDialog(true);
      } catch (error: any) {
        console.log(error.response.data);
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
      setIsPendingPostRecord(false);
      return;
    }

    // Normal record
    try {
      const file = {
        uri: appRecordImg,
        type: "image/jpeg",
        name: `${appVisitorId}_normal_record_photo.jpg`,
      };
      const param: LogControllerApiCreateNewLogRequest = {
        request: {
          labId: appLabId ?? "",
          userId: appVisitorId ?? "",
          recordType: appRecordType ?? undefined,
          logType: "LEGAL",
        },
        file: file,
      };
      await logControllerApi.createNewLog(param, {
        headers: { Authorization: `Bearer ${appToken}` },
      });
      setIsSuccessDialog(true);
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
      <ScreenHeader title="Record Activity" />

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
              value={appVisitorName ?? "Not Found"}
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
              value={appVisitorId ?? "Not Found"}
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
              value={appVisitorEmail ?? "Not found"}
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
              value={appRecordType ?? undefined}
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

      {/* Success Dialog */}
      <SuccessDialog
        title={"Success"}
        content="Member's activity is successfully recorded."
        visible={isSuccessDialog}
        setVisible={setIsSuccessDialog}
        onCloseDialog={() => {
          router.dismissAll();
          removeAppRecord();
        }}
      />
    </View>
  );
};

export default RecordScreen;

// Styles
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
