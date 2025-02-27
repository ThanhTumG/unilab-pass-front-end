// Core
import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import dayjs from "dayjs";

// App
import { useUserStore } from "stores";
import useBackHandler from "utils/useBackHandler";

// Types
type Props = {};

// Component
const RecordScreen = (props: Props) => {
  const { idDetected, recordType } = useLocalSearchParams();

  // Today
  const initialDate = dayjs().format("DD MMM YYYY\nHH:mm");
  // Router
  const router = useRouter();

  // Store
  const { appLabName } = useUserStore();

  // handle back
  useBackHandler(() => {
    router.replace("/(tabs)/RecordActivityScreen");
    return true;
  });

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
          style={{ position: "absolute", left: 10, zIndex: 10 }}
          size={32}
          iconColor="#808080"
          onPress={() => router.replace("/(tabs)/RecordActivityScreen")}
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
          Record Activity
        </Text>
      </View>

      <ScrollView>
        {/* Content */}
        <View style={styles.container}>
          {/* Information */}
          <View style={styles.infoContainer}>
            <Text
              variant="titleMedium"
              style={{
                fontFamily: "Poppins-SemiBold",
                alignSelf: "flex-start",
              }}
            >
              Member information
            </Text>

            {/* Name */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              value="Not found"
              label="Full Name"
            />

            {/* ID */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={idDetected as string}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="Id"
            />

            {/* Email */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={"Not found"}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="Email"
            />
          </View>

          {/* Time */}
          <View style={styles.timeContainer}>
            <Text
              variant="titleMedium"
              style={{
                fontFamily: "Poppins-SemiBold",
                alignSelf: "flex-start",
              }}
            >
              Time & Location
            </Text>

            {/* Time */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={initialDate}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="Time Record"
            />

            {/* Lab */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={appLabName ?? ""}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
              }}
              label="Lab Name"
            />

            {/* Type */}
            <TextInput
              theme={{
                colors: {
                  primary: "#2B56F0",
                  onSurfaceVariant: "#777",
                },
              }}
              textColor="#333"
              mode="outlined"
              disabled
              style={styles.inputField}
              value={recordType as string}
              contentStyle={{
                fontFamily: "Poppins-Regular",
                marginTop: 8,
                textTransform: "capitalize",
              }}
              label="Record Type"
            />
          </View>

          {/* Action Button */}
          <Button
            labelStyle={{ fontFamily: "Poppins-Medium" }}
            mode="contained"
            style={styles.actButton}
          >
            Record
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 15,
    paddingBottom: 30,
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    gap: 10,
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
    width: 300,
    gap: 10,
  },
  inputField: {
    maxHeight: 77,
    width: 300,
    backgroundColor: "transparent",
  },
  time: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  actButton: {
    marginTop: 70,
    borderRadius: 5,
    minWidth: 300,
    minHeight: 40,
  },
});
