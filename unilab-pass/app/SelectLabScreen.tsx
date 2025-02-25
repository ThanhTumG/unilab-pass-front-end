// Core
import { ImageBackground, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Icon,
  Text,
  TextInput,
} from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

// App
import {
  CustomDropdownInput,
  CustomDropdownItem,
} from "components/CustomDropdown";
import { LabCreationRequest, LaboratoryControllerApi } from "api/index";
import { useAuthStore, useUserStore } from "stores";

// Types
type Props = {};
type LabInfo = {
  label: string;
  value: string;
  location: string;
};

// Component
const SelectLabScreen = (props: Props) => {
  // States
  const [labId, setLabId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [myLabList, setMyLabList] = useState<LabInfo[]>([]);

  // Router
  const router = useRouter();

  // Store
  const { appToken } = useAuthStore();
  const { setAppUser } = useUserStore();

  // Server
  const laboratoryControllerApi = new LaboratoryControllerApi();

  // Methods
  // Handle press homepage button
  const handlePressHomePage = async () => {
    if (!labId) return;
    const currentLab = myLabList.find((lab) => lab.value == labId);
    setAppUser({
      labId: labId,
      labName: currentLab?.label,
      labLocation: currentLab?.location,
    });
    router.replace("/(tabs)/HomeScreen");
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
              label: lab.lab?.name || "",
              value: lab.lab?.id || "",
              location: lab.lab?.location || "",
            };
            return obj;
          }) ?? [];
        console.log("Successful get lab list: ", newLabLst);
        setMyLabList(newLabLst);
      })
      .catch((error) => console.log("Error get lab: ", error.response.data));
    setIsLoading(false);
  };

  // Handle create lab
  const handleCreateLab = async () => {
    const param: LabCreationRequest = {
      name: `Lab ${(myLabList?.length as number) + 1}`,
      location: "",
      capacity: 12,
    };
    const options = { headers: { Authorization: `Bearer ${appToken}` } };
    setIsLoadingCreate(true);
    await laboratoryControllerApi
      .createLab({ labCreationRequest: param }, options)
      .then((response) => {
        console.log("Successful create new lab: ", response.data.result);
        const { appToken: latestToken } = useAuthStore.getState();
        handleGetAllLab(latestToken ?? "");
      })
      .catch((error) => console.log(error.response.data));
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
      style={[styles.background, styles.alignCenter]}
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
          contentStyle={{ width: 270, height: 50 }}
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
    paddingBottom: 170,
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
