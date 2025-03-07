// Core
import {
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Icon, Searchbar, Text, useTheme } from "react-native-paper";
import { FlatList } from "react-native";

// App
import FilterAccess from "components/FilterAccess";
import Record from "components/Record";
import { useAuthStore, useUserStore } from "stores";
import { LogControllerApi, LogRespond } from "api/index";
import { useFocusEffect } from "expo-router";

// Types
type Props = {};

// Component
const ManageAccessScreen = (props: Props) => {
  // States
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isPendingGetLog, setIsPendingGetLog] = useState<boolean>(false);
  const [logList, setLogList] = useState<LogRespond[]>();

  // Theme
  const theme = useTheme();
  // Server
  const logControllerApi = new LogControllerApi();

  // Store
  const { appLabId } = useUserStore();

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
      console.log(
        "Successful get all log:",
        response.data.result?.map((log) => log.id)
      );
      setLogList(response.data.result);
    } catch (error: any) {
      console.error(error.response.data);
    } finally {
      setIsPendingGetLog(false);
    }
  }, [appLabId]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetAllLog();
  }, [handleGetAllLog]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      handleGetAllLog();
    }, [handleGetAllLog])
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
        <FilterAccess />
      </View>
      {/* </View> */}

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
            item: LogRespond;
            index: number;
          }) => {
            return <Record item={item} isEven={index % 2 == 1} />;
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default ManageAccessScreen;

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
