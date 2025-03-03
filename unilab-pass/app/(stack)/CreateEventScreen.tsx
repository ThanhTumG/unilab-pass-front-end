import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  Button,
  Icon,
  IconButton,
  Snackbar,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// App
import useBackHandler from "utils/useBackHandler";
import { EventFormType } from "constants/event.type";
import {
  DEFAULT_EVENT_FORM_VALUES,
  EventFormSchema,
} from "constants/event.constant";
import {
  EventControllerApi,
  EventControllerApiCreateEventRequest,
  EventGuestCreationRequest,
  LabEventCreationRequest,
} from "api/index";
import { useAuthStore, useUserStore } from "stores";
import { combineDate } from "lib/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

// Component
const CreateEventScreen = () => {
  // States
  const [isDatePicker, setIsDatePicker] = useState({
    startDate: false,
    endDate: false,
    startHour: false,
    endHour: false,
  });
  const [isPendingCreateEv, setIsPendingCreateEv] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>();
  const [guestList, setGuestList] = useState<EventGuestCreationRequest[]>();
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  // Router
  const router = useRouter();

  // Server
  const eventControllerApi = new EventControllerApi();

  // Store
  const { appToken } = useAuthStore();
  const { appLabId } = useUserStore();

  // Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormType>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: DEFAULT_EVENT_FORM_VALUES,
  });

  // Methods
  // handle back
  useBackHandler(() => {
    router.replace("/(tabs)/ProfileScreen");
    return true;
  });

  // Handle upload file csv
  const pickCSVFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      if (!file) return undefined;
      setFileName(file.name);
      const response = await fetch(file.uri);
      const text = await response.text();

      const rows = text.trim().split("\n");

      const data = rows.slice(1).map((row) => {
        const values = row.split(",");
        const obj = {
          guestId: values[0],
          name: values[1].trim(),
        };
        return obj;
      });

      setGuestList(data);
    } catch (error) {
      console.error("Error load file:", error);
    }
  };

  // Handle create new event
  const handleCreateNewEvent = async (data: EventFormType) => {
    if (isPendingCreateEv) return;
    setIsPendingCreateEv(true);
    try {
      const timeRange = data.timeRange;
      const eventInfo: LabEventCreationRequest = {
        labId: appLabId ?? "",
        name: data.name,
        startTime: combineDate(timeRange.startDate, timeRange.startHour),
        endTime: combineDate(timeRange.endDate, timeRange.endHour),
      };
      // console.log(guestList);
      const param: EventControllerApiCreateEventRequest = {
        eventWIthGuestCreationRequest: {
          eventInfo,
          guestList,
        },
      };
      const response = await eventControllerApi.createEvent(param, {
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      });

      setAlertMessage("Successful create new event");
      setIsAlert(true);
      setFileName(undefined);
      reset();
      console.log("Successful create event:", response.data.result);
    } catch (error: any) {
      console.log(error.response.data);
    }
    setIsPendingCreateEv(false);
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
          onPress={() => router.replace("/(tabs)/ProfileScreen")}
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
          Create Event
        </Text>
      </View>

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
              Event Information
            </Text>

            {/* Form */}
            {/* Fullname */}
            <Controller
              control={control}
              name="name"
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
                    label="Name"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors.name}
                  />
                  {errors.name && (
                    <Text style={styles.error}>{`${errors.name.message}`}</Text>
                  )}
                </View>
              )}
            />

            {/* Start date */}
            <Controller
              control={control}
              name="timeRange.startDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      setIsDatePicker((prev) => ({
                        ...prev,
                        startDate: true,
                      }));
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
                        textColor="#333"
                        mode="outlined"
                        style={styles.inputField}
                        contentStyle={{
                          fontFamily: "Poppins-Regular",
                          marginTop: 8,
                        }}
                        right={
                          <TextInput.Icon
                            icon={
                              isDatePicker.startDate ? "menu-up" : "menu-down"
                            }
                          />
                        }
                        label="Start date"
                        value={value?.toLocaleDateString()}
                      />
                    </View>
                  </Pressable>

                  {isDatePicker.startDate && (
                    <DateTimePicker
                      value={value ?? new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event, date) => {
                        setIsDatePicker((prev) => ({
                          ...prev,
                          startDate: false,
                        }));
                        if (event.type === "set" && date) {
                          const localDate = dayjs(date)
                            .utc()
                            .tz("Asia/Ho_Chi_Minh")
                            .startOf("day")
                            .toDate();
                          onChange(localDate);
                        }
                      }}
                    />
                  )}
                </View>
              )}
            />

            {/* Start hour */}
            <Controller
              control={control}
              name="timeRange.startHour"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      setIsDatePicker((prev) => ({
                        ...prev,
                        startHour: true,
                      }));
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
                        textColor="#333"
                        mode="outlined"
                        style={styles.inputField}
                        contentStyle={{
                          fontFamily: "Poppins-Regular",
                          marginTop: 8,
                        }}
                        right={
                          <TextInput.Icon
                            icon={
                              isDatePicker.startHour ? "menu-up" : "menu-down"
                            }
                          />
                        }
                        label="Start hour"
                        value={value}
                      />
                    </View>
                  </Pressable>

                  {isDatePicker.startHour && (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display="spinner"
                      onChange={(event, date) => {
                        setIsDatePicker((prev) => ({
                          ...prev,
                          startHour: false,
                        }));
                        if (event.type === "set" && date)
                          onChange(dayjs(date).format("HH:mm"));
                      }}
                    />
                  )}
                </View>
              )}
            />

            {/* End date */}
            <Controller
              control={control}
              name="timeRange.endDate"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      setIsDatePicker((prev) => ({
                        ...prev,
                        endDate: true,
                      }));
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
                        textColor="#333"
                        mode="outlined"
                        style={styles.inputField}
                        contentStyle={{
                          fontFamily: "Poppins-Regular",
                          marginTop: 8,
                        }}
                        right={
                          <TextInput.Icon
                            icon={
                              isDatePicker.endDate ? "menu-up" : "menu-down"
                            }
                          />
                        }
                        label="End date"
                        value={value?.toLocaleDateString()}
                      />
                    </View>
                  </Pressable>

                  {isDatePicker.endDate && (
                    <DateTimePicker
                      value={value ?? new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event, date) => {
                        setIsDatePicker((prev) => ({
                          ...prev,
                          endDate: false,
                        }));
                        if (event.type === "set" && date) {
                          const localDate = dayjs(date)
                            .utc()
                            .tz("Asia/Ho_Chi_Minh")
                            .startOf("day")
                            .toDate();
                          onChange(localDate);
                        }
                      }}
                    />
                  )}
                </View>
              )}
            />

            {/* End hour */}
            <Controller
              control={control}
              name="timeRange.endHour"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      setIsDatePicker((prev) => ({
                        ...prev,
                        endHour: true,
                      }));
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
                        textColor="#333"
                        mode="outlined"
                        style={styles.inputField}
                        contentStyle={{
                          fontFamily: "Poppins-Regular",
                          marginTop: 8,
                        }}
                        right={
                          <TextInput.Icon
                            icon={
                              isDatePicker.endHour ? "menu-up" : "menu-down"
                            }
                          />
                        }
                        label="End hour"
                        value={value}
                      />
                    </View>
                  </Pressable>

                  {isDatePicker.endHour && (
                    <DateTimePicker
                      value={new Date()}
                      mode="time"
                      display="spinner"
                      onChange={(event, date) => {
                        setIsDatePicker((prev) => ({
                          ...prev,
                          endHour: false,
                        }));
                        if (event.type === "set" && date)
                          onChange(dayjs(date).format("HH:mm"));
                      }}
                    />
                  )}
                </View>
              )}
            />

            {/* Upload file */}
            <View style={{ marginTop: 37, gap: 10 }}>
              <Text
                variant="titleMedium"
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                Member list
              </Text>
              <TouchableRipple style={styles.fileUpload} onPress={pickCSVFile}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Icon
                    source={"plus-circle-outline"}
                    color="#A6A6A6"
                    size={30}
                  />
                  <Text
                    variant="bodySmall"
                    style={{ fontFamily: "Poppins-Regular", color: "#A6A6A6" }}
                  >
                    {fileName || "click here to import guests file (.csv)"}
                  </Text>
                </View>
              </TouchableRipple>
            </View>
          </View>

          {/* Action Button */}
          <Button
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            mode="contained"
            style={styles.actButton}
            onPress={handleSubmit(handleCreateNewEvent)}
            loading={isPendingCreateEv}
          >
            Create
          </Button>
        </View>
      </ScrollView>

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

export default CreateEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "100%",
  },
  scrollView: {
    marginTop: 80,
    paddingBottom: 30,
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
  fileUpload: {
    width: 300,
    height: 77,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A6A6A6",
    borderRadius: 5,
  },
  actButton: {
    marginTop: 80,
    borderRadius: 5,
    minWidth: 300,
    minHeight: 40,
  },
});
