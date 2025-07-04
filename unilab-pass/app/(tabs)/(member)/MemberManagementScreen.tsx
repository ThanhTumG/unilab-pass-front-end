// Core
import React, { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import {
  Icon,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

// App
import { getFullName } from "lib/utils";
import MemberCard from "components/MemberCard";
import { LabMemberControllerApi } from "api/index";
import { useAuthStore, useUserStore } from "stores";
import EmptyIcon from "components/ui/EmptyIcon";

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
const MemberManagementScreen = (props: Props) => {
  // States
  const [searchQuery, setSearchQuery] = React.useState("");
  const [memberList, setMemberList] = useState<MemberType[]>();
  const [isPendingGetMemList, setIdPendingGetMemList] =
    useState<boolean>(false);

  // Server
  const labMemberControllerApi = new LabMemberControllerApi();

  // Store
  const { appLabId } = useUserStore.getState();
  const { appIsFetchedMember, setAppIsFetchedMember } = useUserStore();

  // Router
  const router = useRouter();

  // Theme
  const theme = useTheme();

  // Method
  // Handle get detail account
  const handleViewDetailMember = (id: string) => {
    router.push({
      pathname: "/(tabs)/(member)/DetailMemberScreen",
      params: { id },
    });
  };

  // Handle create new member
  const handleCreateNewMember = () => {
    router.push("/(tabs)/(member)/CreateMemberScreen");
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
      console.log("Successfully get members");
      setMemberList(newLabMemberList);
      setSearchQuery("");
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data);
      }
    } finally {
      setIdPendingGetMemList(false);
    }
  }, [appLabId]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetMember();
  }, [handleGetMember]);

  // Memo
  const filterMemberLst = useMemo(() => {
    return memberList?.filter((member) => {
      const isSearch = searchQuery !== "";

      const query = searchQuery.toLowerCase();
      const userIdMatch = member.id.toLowerCase().includes(query) ?? false;
      const userNameMatch =
        member.fullName.toLowerCase().includes(query) ?? false;

      return isSearch ? userIdMatch || userNameMatch : true;
    });
  }, [searchQuery]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      if (!appIsFetchedMember) {
        handleGetMember();
        setAppIsFetchedMember(true);
      }
    }, [handleGetMember, appIsFetchedMember])
  );

  // Template
  return (
    <ImageBackground
      source={require("../../../assets/images/background-without-logo.png")}
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
          data={filterMemberLst ?? memberList}
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

        {((filterMemberLst && filterMemberLst.length == 0) ||
          memberList?.length == 0) && <EmptyIcon />}
      </View>
    </ImageBackground>
  );
};

export default MemberManagementScreen;

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
