// Core
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Snackbar, Text, TextInput, useTheme } from "react-native-paper";

// App
import { useAuthStore } from "stores";
import Record from "components/Record";
import useEventStore from "stores/useEventStore";
import { EventLogControllerApi, EventLogRespond } from "api/index";
import ScreenHeader from "components/ScreenHeader";
import MemberPhotoModal from "components/MemberPhotoModal";

// Types
type Props = {};

// Components
const DetailEventScreen = (props: Props) => {
  // States
  const [isPendingGetLog, setIsPendingGetLog] = useState<boolean>(false);
  const [logList, setLogList] = useState<EventLogRespond[]>();
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isShowPhoto, setIsShowPhoto] = useState(false);
  const [photoURL, setPhotoURL] = useState<string>("");

  // Theme
  const theme = useTheme();

  // Server
  const eventLogControllerApi = new EventLogControllerApi();

  // Store
  const { appEventName, appEventId, appEventStartTime, appEventEndTime } =
    useEventStore();

  // Methods
  // Handle get event log
  const handleGetEventLog = useCallback(async () => {
    const { appToken } = useAuthStore.getState();

    if (isPendingGetLog) return;
    setIsPendingGetLog(true);
    try {
      const response = await eventLogControllerApi.getEventLogs(
        { eventId: appEventId ?? "" },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );
      console.log("Successfully get event log");
      setLogList(response.data.result);
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsAlert(true);
    } finally {
      setIsPendingGetLog(false);
    }
  }, [appEventId]);

  // Handle press record
  function handlePressRecord(photoUrl: string) {
    setPhotoURL(photoUrl);
    setIsShowPhoto(true);
  }

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetEventLog();
  }, [handleGetEventLog]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      handleGetEventLog();
    }, [handleGetEventLog])
  );

  // Template
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#FCFCFC",
      }}
    >
      {/* Header */}
      <ScreenHeader title="Event Information" />

      {/* Event Information */}
      <View style={styles.eventInfoContainer}>
        <Text
          variant="titleMedium"
          style={{
            fontFamily: "Poppins-SemiBold",
            alignSelf: "flex-start",
          }}
        >
          Event information
        </Text>
        {/* Name */}
        <TextInput
          theme={{
            colors: {
              primary: "#2B56F0",
              onSurfaceVariant: "#777",
            },
          }}
          disabled
          textColor="#333"
          mode="outlined"
          style={styles.inputField}
          contentStyle={{
            fontFamily: "Poppins-Regular",
            marginTop: 8,
          }}
          label="Name"
          value={appEventName ?? ""}
        />

        {/* Start time */}
        <TextInput
          theme={{
            colors: {
              primary: "#2B56F0",
              onSurfaceVariant: "#777",
            },
          }}
          disabled
          textColor="#333"
          mode="outlined"
          style={styles.inputField}
          contentStyle={{
            fontFamily: "Poppins-Regular",
            marginTop: 8,
          }}
          label="Start Time"
          value={
            dayjs(appEventStartTime).format("DD MMM YYYY - HH:mm:ss") ?? ""
          }
        />

        {/* End time */}
        <TextInput
          theme={{
            colors: {
              primary: "#2B56F0",
              onSurfaceVariant: "#777",
            },
          }}
          disabled
          textColor="#333"
          mode="outlined"
          style={styles.inputField}
          contentStyle={{
            fontFamily: "Poppins-Regular",
            marginTop: 8,
          }}
          label="End Time"
          value={dayjs(appEventEndTime).format("DD MMM YYYY - HH:mm:ss") ?? ""}
        />

        <Text
          variant="titleMedium"
          style={{
            marginTop: 20,
            fontFamily: "Poppins-SemiBold",
            alignSelf: "flex-start",
          }}
        >
          Event log
        </Text>
      </View>

      {/* Event Log */}
      {/* Table */}
      <View style={styles.recordListContainer}>
        <FlatList
          data={logList}
          keyExtractor={(item) => item.id ?? ""}
          refreshControl={
            <RefreshControl
              refreshing={isPendingGetLog}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({
            item,
            index,
          }: {
            item: EventLogRespond;
            index: number;
          }) => {
            const returnItem = {
              id: item.id,
              userFirstName: item.guestName,
              userLastName: "",
              recordTime: item.recordTime,
              recordType: item.recordType,
              status: item.status,
              userId: item.guestId,
            };
            return (
              <Record
                onPress={() => handlePressRecord(item.photoURL ?? "")}
                item={returnItem}
                isEven={index % 2 == 1}
              />
            );
          }}
        />
      </View>

      {/* Member Photo */}
      <MemberPhotoModal
        visible={isShowPhoto}
        setVisible={setIsShowPhoto}
        photoURL={photoURL}
      />

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
    </View>
  );
};

export default DetailEventScreen;

// Styles
const styles = StyleSheet.create({
  eventInfoContainer: {
    marginTop: 80,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  recordListContainer: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    paddingBottom: 82,
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "transparent",
  },
});
