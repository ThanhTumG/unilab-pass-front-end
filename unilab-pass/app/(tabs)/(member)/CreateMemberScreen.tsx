// Core
import dayjs from "dayjs";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dropdown } from "react-native-paper-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Icon,
  Snackbar,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";

// App
import { splitFullName } from "lib/utils";
import { DetailUserInformationFormType } from "constants/userInfor.type";
import {
  DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  DetailUserInformationFormSchema,
} from "constants/userInfor.constant";
import {
  CustomDropdownInput,
  CustomDropdownItem,
} from "components/CustomDropdown";
import { useAuthStore, useUserStore } from "stores";
import {
  LabMemberControllerApi,
  LabMemberControllerApiAddLabMemberRequest,
} from "api/index";
import ScreenHeader from "components/ScreenHeader";
import ScanFaceModal from "components/ScanFaceModal";

// Types
type Props = {};

// Options
const OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

// Component
const CreateMemberScreen = (props: Props) => {
  // States
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [loading, setLoading] = useState({
    createMem: false,
    updateMem: false,
  });
  const [photoUri, setPhotoUri] = useState<string[]>([]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);

  // Server
  const labMemberControllerApi = new LabMemberControllerApi();

  // Store
  const { appLabId, setAppIsFetchedMember } = useUserStore();

  // Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DetailUserInformationFormType>({
    resolver: zodResolver(DetailUserInformationFormSchema),
    defaultValues: DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  });

  // Methods
  // handle submit form
  const handleAddMember = async (data: DetailUserInformationFormType) => {
    const { appToken: token } = useAuthStore.getState();

    if (loading.createMem || !photoUri.length) return;
    setLoading((prev) => ({ ...prev, createMem: true }));
    const { firstName, lastName } = splitFullName(data.fullName);
    const fileUri = photoUri[photoUri.length - 1];
    const file = {
      uri: fileUri,
      type: "image/jpeg",
      name: `${data.id}_create_mem_photo.jpg`,
    };
    const request = {
      labId: appLabId ?? "",
      userId: data.id,
      dob: data.birth,
      gender: data.gender,
      email: data.email,
      firstName: firstName,
      lastName: lastName,
      role: "MEMBER",
    };
    try {
      const param: LabMemberControllerApiAddLabMemberRequest = {
        request: request,
        file: file,
      };
      await labMemberControllerApi.addLabMember(param, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage("Successfully add member");
      setIsAlert(true);
      reset();
      setPhotoUri([]);
      setAppIsFetchedMember(false);
    } catch (error: any) {
      if (error.response) {
        setAlertMessage(error.response.data.message);
        setIsAlert(true);
      }
    }
    setLoading((prev) => ({ ...prev, createMem: false }));
  };

  // Template
  return (
    <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
      {/* Header */}
      <ScreenHeader title="Create Member" />

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.formField}>
            <Text
              variant="titleMedium"
              style={{
                fontFamily: "Poppins-SemiBold",
                alignSelf: "flex-start",
              }}
            >
              Detail information
            </Text>

            {/* Form */}
            {/* Fullname */}
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    theme={{
                      colors: {
                        primary: "#2B56F0",
                        onSurfaceVariant: "#777",
                      },
                    }}
                    textColor="#333"
                    mode="outlined"
                    style={styles.inputField}
                    contentStyle={{
                      fontFamily: "Poppins-Regular",
                      marginTop: 8,
                    }}
                    label="Fullname"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <Text
                      style={styles.error}
                    >{`${errors.fullName.message}`}</Text>
                  )}
                </View>
              )}
            />

            {/* ID */}
            <Controller
              control={control}
              name="id"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    theme={{
                      colors: {
                        primary: "#2B56F0",
                        onSurfaceVariant: "#777",
                      },
                    }}
                    textColor="#333"
                    mode="outlined"
                    style={styles.inputField}
                    contentStyle={{
                      fontFamily: "Poppins-Regular",
                      marginTop: 8,
                    }}
                    label="ID"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors.id}
                  />
                  {errors.id && (
                    <Text style={styles.error}>{`${errors.id.message}`}</Text>
                  )}
                </View>
              )}
            />

            {/* Birth */}
            <Controller
              control={control}
              name="birth"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      setIsDatePicker((prev) => !prev);
                    }}
                  >
                    <View pointerEvents="none">
                      <TextInput
                        theme={{
                          colors: {
                            primary: "#2B56F0",
                            onSurfaceVariant: "#777",
                          },
                        }}
                        error={!!errors.birth}
                        textColor="#333"
                        mode="outlined"
                        style={styles.inputField}
                        contentStyle={{
                          fontFamily: "Poppins-Regular",
                          marginTop: 8,
                        }}
                        right={
                          <TextInput.Icon
                            style={{ marginTop: 16 }}
                            icon={isDatePicker ? "menu-up" : "menu-down"}
                          />
                        }
                        label="Birth"
                        value={value}
                      />
                    </View>
                  </Pressable>

                  {errors.birth && (
                    <Text
                      style={styles.error}
                    >{`${errors.birth.message}`}</Text>
                  )}

                  {isDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event, date) => {
                        setIsDatePicker(false);
                        if (event.type === "set" && date) {
                          const localDate = dayjs(date)
                            .utc()
                            .tz("Asia/Ho_Chi_Minh")
                            .startOf("day")
                            .toDate();
                          onChange(dayjs(localDate).format("YYYY-MM-DD"));
                        }
                      }}
                    />
                  )}
                </View>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    theme={{
                      colors: {
                        primary: "#2B56F0",
                        onSurfaceVariant: "#777",
                      },
                    }}
                    textColor="#333"
                    mode="outlined"
                    style={styles.inputField}
                    contentStyle={{
                      fontFamily: "Poppins-Regular",
                      marginTop: 8,
                    }}
                    label="Email"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <Text
                      style={styles.error}
                    >{`${errors.email.message}`}</Text>
                  )}
                </View>
              )}
            />

            {/* Gender */}
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View style={{ marginTop: 8 }}>
                  <Dropdown
                    mode="outlined"
                    placeholder="Gender"
                    options={OPTIONS}
                    value={value}
                    onSelect={(value) => onChange(value)}
                    menuUpIcon={
                      <TextInput.Icon
                        icon="menu-up"
                        color="#333"
                        pointerEvents="none"
                      />
                    }
                    error={!!errors.gender}
                    menuDownIcon={
                      <TextInput.Icon
                        icon="menu-down"
                        color="#333"
                        pointerEvents="none"
                      />
                    }
                    menuContentStyle={{
                      marginTop: 25,
                    }}
                    hideMenuHeader={true}
                    CustomDropdownItem={CustomDropdownItem}
                    CustomDropdownInput={CustomDropdownInput}
                  />
                  {errors.gender && (
                    <Text
                      style={styles.error}
                    >{`${errors.gender.message}`}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={{ marginTop: 37, gap: 10 }}>
            <Text
              variant="titleMedium"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Face Authentication
            </Text>
            <TouchableRipple
              style={styles.faceAuth}
              onPress={() => {
                setIsVisibleModal(true);
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Icon
                  source={
                    photoUri.length
                      ? "check-circle-outline"
                      : "plus-circle-outline"
                  }
                  color={photoUri.length ? "#3bb300" : "#A6A6A6"}
                  size={30}
                />
                <Text
                  variant="bodySmall"
                  style={{ fontFamily: "Poppins-Regular", color: "#A6A6A6" }}
                >
                  {photoUri.length
                    ? `Face record successfully`
                    : "click here to scan face"}
                </Text>
              </View>
            </TouchableRipple>
          </View>

          {/* Action Button */}
          <Button
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            mode="contained"
            style={styles.actButton}
            onPress={handleSubmit(handleAddMember)}
            loading={loading.createMem}
          >
            Create
          </Button>
        </View>
      </ScrollView>

      {/* Camera */}
      <ScanFaceModal
        visible={isVisibleModal}
        setVisible={setIsVisibleModal}
        setPhotoUri={setPhotoUri}
      />

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
    </View>
  );
};

export default CreateMemberScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "100%",
    paddingBottom: 30,
  },
  scrollView: {
    marginTop: 80,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textAlign: "center",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -50 }],
    padding: 10,
  },
  formField: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "transparent",
  },
  error: {
    marginLeft: 2,
    color: "red",
    fontFamily: "Poppins-Light",
    fontSize: 12,
  },

  faceAuth: {
    width: 300,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A6A6A6",
    borderRadius: 5,
  },
  actButton: {
    marginTop: 60,
    borderRadius: 5,
    minWidth: 300,
    minHeight: 40,
  },
});
