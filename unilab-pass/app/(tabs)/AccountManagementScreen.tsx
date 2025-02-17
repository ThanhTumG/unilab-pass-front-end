// Core
import { FlatList, ImageBackground, StyleSheet, View } from "react-native";
import React from "react";
import {
  Icon,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
} from "react-native-paper";
import Table from "components/Table";
import { useRouter } from "expo-router";

import MemberCard from "components/MemberCard";

// Types
type Props = {};

// Component
const ManageAccountScreen = (props: Props) => {
  // States
  const [searchQuery, setSearchQuery] = React.useState("");

  // Router
  const router = useRouter();

  const [accountData] = React.useState([
    {
      name: "PHẠM CHÂU THANH TÙNG",
      id: "2115235",
      gender: "Male",
      dateOfBirth: "25-10-2003",
      email: "tung.phamchauthanh@hcmut.edu.vn",
      phone: "0984801203",
      status: "active",
    },
    {
      name: "NGUYỄN VĂN A",
      id: "2115236",
      gender: "Male",
      dateOfBirth: "15-08-2002",
      email: "nguyenvana@hcmut.edu.vn",
      phone: "0984123456",
      status: "active",
    },
    {
      name: "TRẦN THỊ B",
      id: "2115237",
      gender: "Female",
      dateOfBirth: "12-05-2001",
      email: "tranthib@hcmut.edu.vn",
      phone: "0978567890",
      status: "active",
    },
    {
      name: "LÊ HOÀNG NAM",
      id: "2115238",
      gender: "Male",
      dateOfBirth: "20-11-2000",
      email: "lehoangnam@hcmut.edu.vn",
      phone: "0901234567",
      status: "active",
    },
    {
      name: "VŨ MINH ANH",
      id: "2115239",
      gender: "Female",
      dateOfBirth: "05-09-2002",
      email: "vuminhanh@hcmut.edu.vn",
      phone: "0912345678",
      status: "active",
    },
    {
      name: "ĐẶNG THẾ KIỆT",
      id: "2115240",
      gender: "Male",
      dateOfBirth: "30-07-2001",
      email: "dangthekiet@hcmut.edu.vn",
      phone: "0923456789",
      status: "active",
    },
    {
      name: "HOÀNG KIM NGÂN",
      id: "2115241",
      gender: "Female",
      dateOfBirth: "18-04-2003",
      email: "hoangkimngan@hcmut.edu.vn",
      phone: "0934567890",
      status: "active",
    },
    {
      name: "TRẦN VĂN DŨNG",
      id: "2115242",
      gender: "Male",
      dateOfBirth: "10-02-2000",
      email: "tranvandung@hcmut.edu.vn",
      phone: "0945678901",
      status: "blocked",
    },
    {
      name: "PHAN THỊ HỒNG",
      id: "2115243",
      gender: "Female",
      dateOfBirth: "25-12-2002",
      email: "phanthihong@hcmut.edu.vn",
      phone: "0956789012",
      status: "active",
    },
    {
      name: "BÙI GIA HUY",
      id: "2115244",
      gender: "Male",
      dateOfBirth: "08-06-2001",
      email: "buigiahuy@hcmut.edu.vn",
      phone: "0967890123",
      status: "active",
    },
    {
      name: "LÝ THU TRANG",
      id: "2115245",
      gender: "Female",
      dateOfBirth: "14-03-2003",
      email: "lythutrang@hcmut.edu.vn",
      phone: "0978901234",
      status: "active",
    },
    {
      name: "HỒ VĂN BẢO",
      id: "2115246",
      gender: "Male",
      dateOfBirth: "22-09-2002",
      email: "hovanbao@hcmut.edu.vn",
      phone: "0989012345",
      status: "active",
    },
    {
      name: "NGUYỄN THỊ MAI",
      id: "2115247",
      gender: "Female",
      dateOfBirth: "06-07-2001",
      email: "nguyenthimai@hcmut.edu.vn",
      phone: "0990123456",
      status: "active",
    },
    {
      name: "TRỊNH ĐỨC ANH",
      id: "2115248",
      gender: "Male",
      dateOfBirth: "17-01-2003",
      email: "trinhducanh@hcmut.edu.vn",
      phone: "0902345678",
      status: "active",
    },
    {
      name: "ĐỖ MINH CHÂU",
      id: "2115249",
      gender: "Female",
      dateOfBirth: "03-05-2000",
      email: "dominchau@hcmut.edu.vn",
      phone: "0913456789",
      status: "active",
    },
  ]);

  // Method
  // Handle detail account
  // const handleShowDetailAccount = (id: string) => {
  //   router.replace(`/`);
  // };

  // Handle create new member
  const handleCreateNewMember = () => {
    router.replace("/(stack)/CreateMemberScreen");
  };

  // Template
  return (
    <ImageBackground
      source={require("../../assets/images/background-without-logo.png")}
      style={[styles.background]}
    >
      {/* Title */}
      <Text variant="titleSmall" style={styles.title}>
        Account Management
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

      {/* Table */}
      {/* <Table
        mode="account"
        data={accountData}
        columns={["id", "name", "email"]}
      /> */}
      <View style={styles.memberListContainer}>
        <FlatList
          data={accountData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }: { item: any; index: any }) => {
            return <MemberCard item={item} isEven={index % 2 == 1} />;
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
