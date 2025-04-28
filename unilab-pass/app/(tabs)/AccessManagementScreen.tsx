// Core
import { FlatList } from "react-native";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Icon, Searchbar, Text, useTheme } from "react-native-paper";
import {
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

// App
import Record from "components/Record";
import { getFullName } from "lib/utils";
import EmptyIcon from "components/ui/EmptyIcon";
import FilterAccess from "components/FilterAccess";
import { useAuthStore, useUserStore } from "stores";
import { LogControllerApi, LogRespond } from "api/index";
import MemberPhotoModal from "components/MemberPhotoModal";

// Types
type Props = {};

type MarkedDatesType = {
  currentDate: string;
  markedDates: {
    startDate?: string;
    endDate?: string;
  };
  mode: "week" | "month";
};

// Component
const ManageAccessScreen = (props: Props) => {
  // States
  const initialDate = new Date().toISOString().split("T")[0];
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isPendingGetLog, setIsPendingGetLog] = useState<boolean>(false);
  const [logList, setLogList] = useState<LogRespond[]>();
  const [isShowPhoto, setIsShowPhoto] = useState(false);
  const [photoURL, setPhotoURL] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({
    currentDate: initialDate,
    markedDates: {
      startDate: undefined,
      endDate: undefined,
    },
    mode: "week",
  });

  // Theme
  const theme = useTheme();

  // Server
  const logControllerApi = new LogControllerApi();

  // Store
  const { appLabId, appIsFetchedRecord, setAppIsFetchedRecord } =
    useUserStore();

  // Methods
  // Handle get all log
  const handleGetAllLog = useCallback(async () => {
    const { appToken } = useAuthStore.getState();
    if (isPendingGetLog) return;
    setIsPendingGetLog(true);
    try {
      const response = await logControllerApi.getAllLogs(
        { labId: appLabId ?? "" },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );
      console.log("Successfully get all log");
      setLogList(response.data.result);
      setMarkedDates({
        currentDate: initialDate,
        markedDates: {
          startDate: undefined,
          endDate: undefined,
        },
        mode: "week",
      });
      setSearchQuery("");
    } catch (error: any) {
      console.error(error.response.data);
    } finally {
      setIsPendingGetLog(false);
    }
  }, [appLabId]);

  // Memo
  const filterLogList = useMemo(() => {
    // Filter logList by markedDates
    return logList?.filter((log) => {
      const startDate = markedDates.markedDates.startDate;
      const endDate = markedDates.markedDates.endDate;

      const isFilByDate = startDate && endDate;
      const recordDate = new Date(log.recordTime ?? "");
      const start = isFilByDate ? new Date(startDate) : undefined;
      const end = isFilByDate ? new Date(endDate) : undefined;
      end && end.setHours(23, 59, 59, 999);

      const isDateInRange =
        start && end ? recordDate >= start && recordDate <= end : undefined;

      const isSearch = searchQuery !== "";

      const query = searchQuery.toLowerCase();
      const userFullName = getFullName({
        firstName: log.userFirstName,
        lastName: log.userLastName,
      });
      const userIdMatch = log.userId?.toLowerCase().includes(query) ?? false;
      const userNameMatch = userFullName.toLowerCase().includes(query) ?? false;

      return isFilByDate && isSearch
        ? isDateInRange && (userIdMatch || userNameMatch)
        : isFilByDate
        ? isDateInRange
        : isSearch
        ? userIdMatch || userNameMatch
        : true;
    });
  }, [markedDates, searchQuery]);

  // Handle press record
  const handlePressRecord = (photoUrl: string) => {
    setPhotoURL(photoUrl);
    setIsShowPhoto(true);
  };

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetAllLog();
  }, [handleGetAllLog]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      if (!appIsFetchedRecord) {
        setAppIsFetchedRecord(true);
        handleGetAllLog();
      }
    }, [handleGetAllLog, appIsFetchedRecord])
  );

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Title */}
      <Text variant="titleSmall" style={styles.title}>
        Access Management
      </Text>

      {/* Search bar */}
      <Searchbar
        placeholder="Search by ID or Name"
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        icon={() => <Icon source="magnify" color={"#777"} size={22} />}
        inputStyle={styles.searchInput}
        value={searchQuery}
      />

      {/* Filter */}
      <View style={{ position: "absolute", top: 35, right: 20 }}>
        <FilterAccess
          markedDates={markedDates}
          setMarkedDates={setMarkedDates}
        />
      </View>

      {/* Table */}
      <View style={styles.recordListContainer}>
        <FlatList
          data={filterLogList ?? logList}
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
            item: LogRespond;
            index: number;
          }) => {
            return (
              <Record
                item={item}
                isEven={index % 2 == 1}
                onPress={() => handlePressRecord(item.photoURL ?? "")}
              />
            );
          }}
        />

        {((filterLogList && filterLogList?.length == 0) ||
          logList?.length == 0) && <EmptyIcon />}
      </View>

      {/* Member Photo */}
      <MemberPhotoModal
        visible={isShowPhoto}
        setVisible={setIsShowPhoto}
        photoURL={photoURL}
      />
    </ImageBackground>
  );
};

export default ManageAccessScreen;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignContent: "flex-start",
    marginLeft: 30,
    marginRight: 20,
    marginTop: 100,
    backgroundColor: "#333",
  },
  title: {
    marginLeft: 25,
    marginTop: 45,
    marginRight: "auto",
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textAlignVertical: "center",
  },
  searchBar: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "rgba(0, 0, 0, 0.15)",
    borderWidth: 1,
    marginHorizontal: 17,
    marginTop: 20,
    maxHeight: 40,
  },
  searchInput: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    minHeight: 50,
    textAlignVertical: "center",
    marginTop: -5,
  },
  recordListContainer: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    marginTop: 21,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    paddingBottom: 82,
  },
});
