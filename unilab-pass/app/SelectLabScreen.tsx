// Core
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { Dropdown } from "react-native-paper-dropdown";
import { useFocusEffect, useRouter } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Icon,
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
  // Handle press homepage button
  const handlePressHomePage = async () => {
    if (!labId) return;
    const currentLab = myLabList.find((lab) => lab.value == labId);
    setIsLoading(true);
    try {
      const response = await eventControllerApi.getCurrentEvent(
        { labId: labId },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );

      console.log("Success get current event:", response.data.result);
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
      console.error(error.response.data);
    }
    setIsLoading(true);
  };

  // Handle get all lab
  const handleGetAllLab = async (token?: string) => {
    if (isLoading) return;
    const finalToken = token || appToken;
    setIsLoading(true);
    await laboratoryControllerApi
      .getAllLabs({ headers: { Authorization: `Bearer ${finalToken}` } })
      .then((response) => {
        const newLabLst =
          response.data.result?.map((lab) => {
            const obj: LabInfo = {
              label: lab.name || "",
              value: lab.id || "",
              location: lab.location || "",
            };
            return obj;
          }) ?? [];
        console.log("Successful get lab list");
        setMyLabList(newLabLst);
      })
      .catch((error) => console.error("Error get lab: ", error.response.data));
    setIsLoading(false);
  };

  // Handle create lab
  const handleCreateLab = async () => {
    const param: LabCreationRequest = {
      name: `Lab ${now.format("YYYY/MM/DD HH:mm")}`,
      location: "",
      capacity: 12,
    };
    const options = { headers: { Authorization: `Bearer ${appToken}` } };
    setIsLoadingCreate(true);
    await laboratoryControllerApi
      .createLab({ labCreationRequest: param }, options)
      .then((response) => {
        console.log("Successful create new lab");
        const { appToken: latestToken } = useAuthStore.getState();
        handleGetAllLab(latestToken ?? "");
      })
      .catch((error) => console.error(error.response.data));
    setIsLoadingCreate(false);
  };

  // Effects
  useFocusEffect(
    useCallback(() => {
      if (myLabList.length === 0) handleGetAllLab();
    }, [appToken])
  );

  // Template
  return isLoading ? (
    <ActivityIndicator animating={true} style={{ top: 100 }} />
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

      {/* Go to Homepage */}
      <Button
        style={{
          position: "absolute",
          bottom: 5,
          right: 5,
        }}
        mode="text"
        onPress={handlePressHomePage}
        textColor="#1B61B5"
      >
        <View style={[styles.homeButton, styles.alignCenter]}>
          <Text
            variant="titleMedium"
            style={{
              fontFamily: "Poppins-Medium",
              color: "#1B61B5",
            }}
          >
            Home
          </Text>
          <Icon source="chevron-right" color="#1B61B5" size={20} />
        </View>
      </Button>
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
  homeButton: {
    flexDirection: "row",
  },
});
