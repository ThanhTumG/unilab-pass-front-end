// Core
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "react-native-paper-dropdown";
import { useFocusEffect, useRouter } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

// App
import useEventStore from "stores/useEventStore";
import { useAuthStore, useUserStore } from "stores";
import {
  CustomDropdownInput,
  CustomDropdownItem,
} from "components/CustomDropdown";
import {
  EventControllerApi,
  LabCreationRequest,
  LaboratoryControllerApi,
} from "api/index";

// Types
type Props = {};
type LabInfo = {
  label: string;
  value: string;
  location: string;
};

// Time
const now = dayjs();

// Component
const SelectLabScreen = (props: Props) => {
  // States
  const [labId, setLabId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [myLabList, setMyLabList] = useState<LabInfo[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  // Router
  const router = useRouter();

  // Server
  const laboratoryControllerApi = new LaboratoryControllerApi();
  const eventControllerApi = new EventControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { setAppUser } = useUserStore();
  const { setAppIsEvent, setAppEvent } = useEventStore();

  // Methods
  // Handle get all lab
  const handleGetAllLab = async (token?: string) => {
    if (isLoading) return;
    const finalToken = token || appToken;
    setIsLoading(true);
    try {
      const response = await laboratoryControllerApi.getAllLabs({
        headers: { Authorization: `Bearer ${finalToken}` },
      });
      const newLabLst =
        response.data.result?.map((lab) => {
          const obj: LabInfo = {
            label: lab.name || "",
            value: lab.id || "",
            location: lab.location || "",
          };
          return obj;
        }) ?? [];
      console.log("Successfully get lab list");
      setMyLabList(newLabLst);
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsAlert(true);
    }
    setIsLoading(false);
  };

  // Handle create lab
  const handleCreateLab = async () => {
    if (isLoadingCreate) return;
    setIsLoadingCreate(true);
    try {
      const param: LabCreationRequest = {
        name: `Lab ${now.format("YYYY/MM/DD HH:mm")}`,
        location: "",
        capacity: 12,
      };
      const options = { headers: { Authorization: `Bearer ${appToken}` } };
      await laboratoryControllerApi.createLab(
        { labCreationRequest: param },
        options
      );
      const { appToken: latestToken } = useAuthStore.getState();
      handleGetAllLab(latestToken ?? "");
    } catch (error: any) {
      setAlertMessage(error.response.data.message);
      setIsAlert(true);
    }
    setIsLoadingCreate(false);
  };

  // Effects
  useFocusEffect(
    useCallback(() => {
      if (myLabList.length === 0) handleGetAllLab();
    }, [appToken])
  );

  useEffect(() => {
    // Handle press homepage button
    const handlePressHomePage = async () => {
      if (!labId) return;
      setIsLoading(true);
      const currentLab = myLabList.find((lab) => lab.value == labId);
      try {
        const response = await eventControllerApi.getCurrentEvent(
          { labId: labId },
          { headers: { Authorization: `Bearer ${appToken}` } }
        );
        const event = response.data.result;
        if (event?.id) {
          setAppIsEvent(true);
          setAppEvent({
            eventId: event.id,
            eventName: event.name,
            startTime: event.startTime,
            endTime: event.endTime,
          });
        }
        setAppUser({
          labId: labId,
          labName: currentLab?.label,
          labLocation: currentLab?.location,
        });
        router.replace("/(tabs)/HomeScreen");
      } catch (error: any) {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
      setIsLoading(false);
    };

    if (!!labId) handlePressHomePage();
  }, [labId]);

  // Template
  return isLoading ? (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.background}
    >
      <ActivityIndicator animating={true} />
    </ImageBackground>
  ) : (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.background}
    >
      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        Select Lab
      </Text>

      {/* Select */}
      <View style={[styles.content, styles.alignCenter]}>
        <Dropdown
          placeholder="Select your lab"
          options={myLabList}
          value={labId}
          onSelect={setLabId}
          menuContentStyle={{
            marginTop: 25,
          }}
          menuUpIcon={
            <TextInput.Icon icon="menu-up" color="#333" pointerEvents="none" />
          }
          menuDownIcon={
            <TextInput.Icon
              icon="menu-down"
              color="#333"
              pointerEvents="none"
            />
          }
          mode="outlined"
          hideMenuHeader={true}
          CustomDropdownItem={CustomDropdownItem}
          CustomDropdownInput={CustomDropdownInput}
        />

        <Text
          variant="bodyMedium"
          style={{ fontFamily: "Poppins-Regular", color: "#333" }}
        >
          Or
        </Text>

        {/* Create Lab Button */}
        <Button
          mode="outlined"
          style={{ borderRadius: 5 }}
          textColor="#333"
          contentStyle={{ width: 300, height: 50 }}
          onPress={handleCreateLab}
          loading={isLoadingCreate}
          disabled={isLoadingCreate}
        >
          Create new Lab
        </Button>
      </View>

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
    </ImageBackground>
  );
};

export default SelectLabScreen;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    paddingVertical: 150,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#1B61B5",
  },
  content: {
    maxHeight: 200,
    marginTop: 40,
    gap: 30,
  },
});
