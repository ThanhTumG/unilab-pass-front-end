// Core
import { useFocusEffect, useRouter } from "expo-router";
import {
  Icon,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import React, { useCallback, useState } from "react";
import { barDataItem } from "react-native-gifted-charts";
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// App
import CustomCard from "components/CustomCard";
import { useAuthStore, useUserStore } from "stores";
import CustomBarChart from "components/CustomBarChart";
import { LogControllerApi, WeeklyReportResponse } from "api/index";

// Types
type Props = {};

// Constants
const DEFAULT_LOG_LIST: barDataItem[] = Array.from({ length: 7 }, (_, i) => [
  { value: 0, spacing: 0 },
  { value: 0, frontColor: "#B27FFF", isSecondary: true },
]).flat();

// Component
const HomeScreen = (props: Props) => {
  // States
  const [isPendingGet, setIsPendingGet] = useState<boolean>(false);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReportResponse>();
  const [weeklyLog, setWeeklyLog] = useState<barDataItem[]>(DEFAULT_LOG_LIST);

  // Theme
  const theme = useTheme();

  // Router
  const router = useRouter();

  // Server
  const logControllerApi = new LogControllerApi();

  // Store
  const { appLabId, appIsFetchedWeeklyReport, setAppIsFetchedWeeklyReport } =
    useUserStore();

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

      const newLogList =
        logList?.flatMap((log) => [
          { value: log.checkInCount ?? 0, spacing: 0 },
          {
            value: log.checkOutCount ?? 0,
            frontColor: "#B27FFF",
            isSecondary: true,
          },
        ]) ?? DEFAULT_LOG_LIST;
      setWeeklyLog(newLogList);
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data);
      }
    } finally {
      setIsPendingGet(false);
    }
  }, [appLabId]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetWeeklyReport();
  }, [handleGetWeeklyReport]);

  // Handle get notification
  const handleGetNotification = () => {
    router.push("/(tabs)/(home)/NotificationScreen");
  };

  // Effects
  useFocusEffect(
    useCallback(() => {
      if (!appIsFetchedWeeklyReport) {
        handleGetWeeklyReport();
        setAppIsFetchedWeeklyReport(true);
      }
    }, [handleGetWeeklyReport, appIsFetchedWeeklyReport])
  );

  // Template
  return (
    <ImageBackground
      source={require("../../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      <ScrollView
        style={{ alignSelf: "stretch", paddingHorizontal: 10, paddingTop: 35 }}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            refreshing={isPendingGet}
            onRefresh={onRefresh}
          />
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          {/* Welcome */}
          <Text
            variant="titleLarge"
            style={{
              fontFamily: "Poppins-SemiBold",
              color: "#333",
              textAlignVertical: "center",
            }}
          >
            Welcome,
          </Text>

          {/* Notification button */}
          <Surface style={[styles.bell]} elevation={1}>
            <TouchableRipple
              borderless
              style={styles.bell}
              onPress={handleGetNotification}
            >
              <Icon size={22} color="#1B61B5" source={"bell-outline"} />
            </TouchableRipple>
          </Surface>
        </View>

        {/* Card */}
        <View style={[styles.alignCenter, styles.cardContainer]}>
          <CustomCard
            title={weeklyReport?.totalUsers?.toString() ?? ""}
            content="TOTAL MEMBERS"
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
        <CustomBarChart data={weeklyLog} />
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
  },
  cardContainer: {
    flexDirection: "row",
    gap: 17,
    paddingTop: 30,
    paddingBottom: 40,
  },
  bell: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
});
