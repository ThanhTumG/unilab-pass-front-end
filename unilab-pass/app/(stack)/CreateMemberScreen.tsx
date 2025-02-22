// Core
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

// App
import useBackHandler from "utils/useBackHandler";
import { Controller, useForm } from "react-hook-form";
import { DetailUserInformationFormType } from "constants/userInfor.type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  DetailUserInformationFormSchema,
} from "constants/userInfor.constant";
import {
  Button,
  Icon,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import {
  CustomDropdownInput,
  CustomDropdownItem,
} from "components/CustomDropdown";

// Types
type Props = {};

// Options
const OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

// Component
const CreateMemberScreen = (props: Props) => {
  // States
  const [gender, setGender] = useState<string | undefined>(
    DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES.gender
  );
  // Router
  const router = useRouter();

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailUserInformationFormType>({
    resolver: zodResolver(DetailUserInformationFormSchema),
    defaultValues: DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  });

  // Methods
  // handle back
  useBackHandler(() => {
    router.replace("/AccountManagementScreen");
    return true;
  });

  // handle submit form
  const handleSubmitForm = (data: DetailUserInformationFormType) => {
    console.log(data);
  };

  // Template
  return (
    <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
      {/* Header */}
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          top: 0,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FCFCFC",
          width: "100%",
          paddingVertical: 20,
        }}
      >
        {/* Go back button */}
        <IconButton
          icon={"chevron-left"}
          size={32}
          iconColor="#808080"
          style={{ position: "absolute", left: 10, zIndex: 10 }}
          onPress={() => router.replace("/(tabs)/AccountManagementScreen")}
        />
        {/* Title */}
        <Text
          variant="titleLarge"
          style={{
            fontFamily: "Poppins-SemiBold",
            color: "#333",
            textAlign: "center",
            flex: 1,
            alignItems: "center",
          }}
        >
          Create Member
        </Text>
      </View>

      {/* Content */}
      <ScrollView>
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
                    mode="flat"
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
                    mode="flat"
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
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    theme={{
                      colors: {
                        primary: "#2B56F0",
                        onSurfaceVariant: "#777",
                      },
                    }}
                    placeholder="YYYY-MM-DD"
                    textColor="#333"
                    mode="flat"
                    style={styles.inputField}
                    contentStyle={{
                      fontFamily: "Poppins-Regular",
                      marginTop: 8,
                    }}
                    label="Birth"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors.birth}
                  />
                  {errors.birth && (
                    <Text
                      style={styles.error}
                    >{`${errors.birth.message}`}</Text>
                  )}
                </View>
              )}
            />

            {/* Gender */}
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Dropdown
                    mode="flat"
                    label="Gender"
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
                    mode="flat"
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

            {/* Phone */}
            <Controller
              control={control}
              name="phone"
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
                    mode="flat"
                    style={styles.inputField}
                    contentStyle={{
                      fontFamily: "Poppins-Regular",
                      marginTop: 8,
                    }}
                    label="Phone"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors.phone}
                  />
                  {errors.phone && (
                    <Text
                      style={styles.error}
                    >{`${errors.phone.message}`}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={{ marginTop: 20, gap: 10 }}>
            <Text
              variant="titleMedium"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Face Authentication
            </Text>
            <TouchableRipple
              style={styles.faceAuth}
              onPress={() => {
                console.log("ngan");
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Icon
                  source={"plus-circle-outline"}
                  color="#A6A6A6"
                  size={30}
                />
                <Text
                  variant="bodySmall"
                  style={{ fontFamily: "Poppins-Regular", color: "#A6A6A6" }}
                >
                  click here to scan face
                </Text>
              </View>
            </TouchableRipple>
          </View>

          {/* Action Button */}
          <Button
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            mode="contained"
            style={styles.actButton}
            onPress={handleSubmit(handleSubmitForm)}
          >
            Create
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateMemberScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 40,
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
    marginTop: 80,
    gap: 3,
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
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A6A6A6",
    borderRadius: 5,
  },
  actButton: {
    marginTop: 37,
    borderRadius: 5,
    minWidth: 300,
    minHeight: 40,
  },
});
