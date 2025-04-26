// Core
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { Snackbar, Text, useTheme } from "react-native-paper";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

// App
import { useAuthStore } from "stores";
import Record from "components/Record";
import EmptyIcon from "components/ui/EmptyIcon";
import ScreenHeader from "components/ScreenHeader";
import MemberPhotoModal from "components/MemberPhotoModal";
import { EventLogControllerApi, EventLogRespond } from "api/index";

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

  // Param
  const { eventId, eventName, startTime, endTime } = useLocalSearchParams();

  // Server
  const eventLogControllerApi = new EventLogControllerApi();

  // Methods
  // Handle get event log
  const handleGetEventLog = useCallback(async () => {
    const { appToken } = useAuthStore.getState();

    if (isPendingGetLog) return;
    setIsPendingGetLog(true);
    try {
      const response = await eventLogControllerApi.getEventLogs(
        { eventId: eventId as string },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );
      console.log("Successfully get event log", response.data);
      setLogList(response.data.result);
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsAlert(true);
    } finally {
      setIsPendingGetLog(false);
    }
  }, [eventId]);

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
      <ScreenHeader title="Event Detail" />

      {/* Event Information */}
      <View style={styles.eventInfoContainer}>
        <Text variant="bodyMedium" style={{ fontFamily: "Poppins-Regular" }}>
          <Text style={{ fontFamily: "Poppins-SemiBold" }}>Event Name: </Text>
          {eventName ?? "N/A"}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ fontFamily: "Poppins-Regular", marginTop: 5 }}
        >
          <Text style={{ fontFamily: "Poppins-SemiBold" }}>Start Time: </Text>
          {startTime
            ? dayjs(startTime as string).format("DD MMM YYYY - HH:mm")
            : "N/A"}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ fontFamily: "Poppins-Regular", marginTop: 5 }}
        >
          <Text style={{ fontFamily: "Poppins-SemiBold" }}>End Time: </Text>
          {endTime
            ? dayjs(endTime as string).format("DD MMM YYYY - HH:mm")
            : "N/A"}
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
        {logList?.length == 0 && <EmptyIcon />}
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
    alignSelf: "stretch",
    paddingHorizontal: 20,
    marginTop: 80,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 5,
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
