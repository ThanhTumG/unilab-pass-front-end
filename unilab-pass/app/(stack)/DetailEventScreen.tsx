// Core
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { IconButton, Text, TextInput, useTheme } from "react-native-paper";
import dayjs from "dayjs";

// App
import useBackHandler from "utils/useBackHandler";
import Record from "components/Record";
import useEventStore from "stores/useEventStore";
import { EventLogControllerApi, EventLogRespond } from "api/index";
import { useAuthStore } from "stores";

// Types
type Props = {};

// Components
const DetailEventScreen = (props: Props) => {
  // States
  const [isPendingGetLog, setIsPendingGetLog] = useState<boolean>(false);
  const [logList, setLogList] = useState<EventLogRespond[]>();

  // Theme
  const theme = useTheme();

  // Router
  const router = useRouter();

  // Server
  const eventLogControllerApi = new EventLogControllerApi();

  // Store
  const { appEventName, appEventId, appEventStartTime, appEventEndTime } =
    useEventStore();

  // Methods
  // handle back
  useBackHandler(() => {
    router.replace("/(tabs)/ProfileScreen");
    return true;
  });

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
      console.log(
        "Successful get event log:",
        response.data.result?.map((log) => log)
      );
      setLogList(response.data.result);
    } catch (error: any) {
      console.error(error.response.data);
    } finally {
      setIsPendingGetLog(false);
    }
  }, [appEventId]);

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
          onPress={() => router.replace("/(tabs)/ProfileScreen")}
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
          Event Information
        </Text>
      </View>

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
            return <Record item={returnItem} isEven={index % 2 == 1} />;
          }}
        />
      </View>
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
