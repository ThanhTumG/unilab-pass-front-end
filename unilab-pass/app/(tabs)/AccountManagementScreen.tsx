// Core
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  Icon,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useFocusEffect, useRouter } from "expo-router";

// App
import MemberCard from "components/MemberCard";
import { LabMemberControllerApi } from "api/index";
import { useAuthStore, useUserStore } from "stores";
import { getFullName } from "lib/utils";

// Types
type Props = {};
type MemberType = {
  id: string;
  gender: string;
  fullName: string;
  lastRecord: string;
  status: string;
};

// Component
const ManageAccountScreen = (props: Props) => {
  // States
  const [searchQuery, setSearchQuery] = React.useState("");
  const [memberList, setMemberList] = useState<MemberType[]>();
  const [isPendingGetMemList, setIdPendingGetMemList] =
    useState<boolean>(false);

  // Server
  const labMemberControllerApi = new LabMemberControllerApi();

  // Store
  const { appLabId } = useUserStore.getState();

  // Router
  const router = useRouter();

  // Theme
  const theme = useTheme();

  // Method
  // Handle get detail account
  const handleViewDetailMember = (id: string) => {
    router.replace(`/(stack)/detail/${id}`);
  };

  // Handle create new member
  const handleCreateNewMember = () => {
    router.replace("/(stack)/CreateMemberScreen");
  };

  // Handle get members
  const handleGetMember = useCallback(async () => {
    const { appToken } = useAuthStore.getState();

    if (isPendingGetMemList) return;
    setIdPendingGetMemList(true);
    try {
      const response = await labMemberControllerApi.getLabMembers(
        { labId: appLabId ?? "" },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );
      const newLabMemberList: MemberType[] =
        response.data.result?.map((data) => {
          const Obj: MemberType = {
            id: data?.id ?? "",
            gender: data.gender ?? "",
            status: data.status ?? "",
            lastRecord: data.lastRecord ?? "",
            fullName: getFullName({
              lastName: data?.lastName,
              firstName: data?.firstName,
            }),
          };
          return Obj;
        }) ?? [];
      console.log("Successful get members: ", newLabMemberList);
      setMemberList(newLabMemberList);
    } catch (error: any) {
      console.error(error.response.data);
    } finally {
      setIdPendingGetMemList(false);
    }
  }, [appLabId]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetMember();
  }, [handleGetMember]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      handleGetMember();
    }, [handleGetMember])
  );

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Title */}
      <Text variant="titleSmall" style={styles.title}>
        Member Management
      </Text>

      {/* Add member button */}
      <Surface
        style={[styles.addMemBtn, { position: "absolute", right: 20, top: 35 }]}
        elevation={1}
      >
        <TouchableRipple
          borderless
          style={styles.addMemBtn}
          onPress={handleCreateNewMember}
        >
          <Icon
            size={22}
            color="#1B61B5"
            source={"account-multiple-plus-outline"}
          />
        </TouchableRipple>
      </Surface>
      {/* Search bar */}
      <Searchbar
        placeholder="Search by ID or Name"
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        icon={() => <Icon source="magnify" color={"#777"} size={22} />}
        inputStyle={styles.searchInput}
        value={searchQuery}
      />
      {/* Data */}
      <View style={styles.memberListContainer}>
        <FlatList
          data={memberList}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isPendingGetMemList}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({ item, index }: { item: any; index: any }) => {
            return (
              <MemberCard
                item={item}
                isEven={index % 2 == 1}
                onPress={handleViewDetailMember}
              />
            );
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default ManageAccountScreen;

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
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
  addMemBtn: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  memberListContainer: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    marginTop: 21,
    borderTopWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
    paddingBottom: 82,
  },
});
