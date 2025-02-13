// Core
import { StyleSheet, View, Modal } from "react-native";
import React, { useState } from "react";
import {
  Button,
  IconButton,
  Text,
  Portal,
  Surface,
  TouchableRipple,
  Icon,
} from "react-native-paper";

// App
import CustomCalendar from "./CustomCalendar";

// Types
type Props = {};

// Component
const FilterAccess = (props: Props) => {
  // States
  const initialDate = new Date().toISOString().split("T")[0];
  const [visible, setVisible] = React.useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [currentDate, setCurrentDate] = useState<string>(initialDate);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // Methods
  const showModal = () => setVisible(true);
  const handleSubmit = () => {
    console.log(markedDates);
  };
  // Template
  return (
    <>
      {/* Trigger */}
      {/* <IconButton
        mode="outlined"
        icon={"filter-variant"}
        containerColor="#fff"
        iconColor="#333"
        onPress={showModal}
      /> */}
      <Surface style={styles.filterBtn} elevation={1}>
        <TouchableRipple
          borderless
          style={styles.filterBtn}
          onPress={showModal}
        >
          <Icon size={22} color="#1B61B5" source={"filter-variant"} />
        </TouchableRipple>
      </Surface>

      {/* Modal */}
      <Portal>
        <View
          style={[styles.container, { display: visible ? "flex" : "none" }]}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(!visible);
            }}
          >
            <View style={[styles.modelContainer]}>
              {/* Model Content */}
              <View style={styles.modalView}>
                {/* Title */}
                <Text
                  style={{ fontFamily: "Poppins-SemiBold" }}
                  variant="titleMedium"
                >
                  Filter Access Data
                </Text>

                {/* Calendar */}
                <CustomCalendar
                  markedDates={markedDates}
                  setMarkedDates={setMarkedDates}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  style={{ marginTop: 33 }}
                />

                {/* Bottom button */}
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    contentStyle={styles.buttonContent}
                    style={{ borderRadius: 4 }}
                    onPress={() => setVisible(!visible)}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    style={{ borderRadius: 4 }}
                    contentStyle={styles.buttonContent}
                    onPress={handleSubmit}
                  >
                    Apply
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </Portal>
    </>
  );
};

export default FilterAccess;

// Styles
const styles = StyleSheet.create({
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    // maxHeight: height,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  filterBtn: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  modelContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "#F5F5F5",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 620,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 20,
  },
  buttonContainer: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginTop: "auto",
    alignSelf: "stretch",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContent: {
    width: 100,
  },
});
