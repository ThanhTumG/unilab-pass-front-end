// Core
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Text, useTheme } from "react-native-paper";
import { barDataItem } from "react-native-gifted-charts";
import { useFocusEffect } from "expo-router";

// App
import CustomCard from "components/CustomCard";
import CustomBarChart from "components/CustomBarChart";
import { useAuthStore, useUserStore } from "stores";
import { LogControllerApi, WeeklyReportResponse } from "api/index";

// Types
type Props = {};

// Component
const HomeScreen = (props: Props) => {
  // States
  const [isPendingGet, setIsPendingGet] = useState<boolean>(false);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReportResponse>();
  const [weeklyLog, setWeeklyLog] = useState<barDataItem[]>();

  // Theme
  const theme = useTheme();

  // Server
  const logControllerApi = new LogControllerApi();

  // Store
  const { appLabId } = useUserStore();

  // Methods
  // Handle get weekly reports
  const handleGetWeeklyReport = useCallback(async () => {
    const { appToken } = useAuthStore.getState();

    if (isPendingGet) return;
    setIsPendingGet(true);
    try {
      const response = await logControllerApi.getWeeklyReport(
        { labId: appLabId ?? "" },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );

      setWeeklyReport(response.data.result);
      const logList = response.data.result?.weeklyLogReport;

      const newLogList = logList?.flatMap((log) => [
        { value: log.checkInCount ?? 0, spacing: 0 },
        {
          value: log.checkOutCount ?? 0,
          frontColor: "#B27FFF",
          isSecondary: true,
        },
      ]);
      setWeeklyLog(newLogList);

      console.log("Successful get weekly report:", response.data.result);
    } catch (error: any) {
      console.error(error.response.data);
    } finally {
      setIsPendingGet(false);
    }
  }, [appLabId]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetWeeklyReport();
  }, [handleGetWeeklyReport]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      handleGetWeeklyReport();
    }, [handleGetWeeklyReport])
  );

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-with-icon.png")}
      style={[styles.background]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            refreshing={isPendingGet}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Welcome */}
        <Text
          variant="titleLarge"
          style={{
            fontFamily: "Poppins-SemiBold",
            color: "#333",
            textAlignVertical: "center",
            marginLeft: 30,
            marginRight: "auto",
          }}
        >
          Welcome,
        </Text>

        {/* Card */}
        <View style={[styles.alignCenter, styles.cardContainer]}>
          <CustomCard
            title={weeklyReport?.totalUsers?.toString() ?? ""}
            content="TOTAL USERS"
            icon="account-multiple-outline"
            color1="#C299FF"
            color2="#8533FF"
          />
          <CustomCard
            title={weeklyReport?.weeklyAccess?.toString() ?? ""}
            content="WEEKLY ACCESSES"
            icon="door-closed"
            color1="#99C2FF"
            color2="#3385FF"
          />
        </View>

        {/* Chart */}
        <CustomBarChart data={weeklyLog ?? []} />
      </ScrollView>
    </ImageBackground>
  );
};

export default HomeScreen;

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
    paddingTop: 100,
  },
  cardContainer: {
    flexDirection: "row",
    gap: 17,
    paddingVertical: 20,
  },
});
