// Core
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Modal } from "react-native";
import {
  Button,
  Text,
  Portal,
  Surface,
  TouchableRipple,
  Icon,
} from "react-native-paper";

// App
import CustomCalendar from "./CustomCalendar";

// Types
type Props = {
  markedDates: MarkedDatesType;
  setMarkedDates: React.Dispatch<React.SetStateAction<MarkedDatesType>>;
};
type MarkedDatesType = {
  currentDate: string;
  markedDates: {
    startDate?: string;
    endDate?: string;
  };
  mode: "week" | "month";
};

// Component
const FilterAccess = ({ markedDates, setMarkedDates }: Props) => {
  // States
  const [visible, setVisible] = React.useState(false);
  const [dates, setDates] = useState(markedDates);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // Methods
  // handle show modal
  const handleShowModal = () => setVisible(true);

  // handle apply filter
  const handleSubmit = () => {
    console.log(dates.markedDates);
    setMarkedDates(dates);
    setVisible(false);
  };

  // handle clear filter
  const handleClear = () => {
    setDates((prev) => ({
      ...prev,
      markedDates: {
        startDate: undefined,
        endDate: undefined,
      },
    }));
    setMarkedDates((prev) => ({
      ...prev,
      markedDates: {
        startDate: undefined,
        endDate: undefined,
      },
    }));
    setVisible(false);
  };

  // Effects
  useEffect(() => {
    setDates(markedDates);
  }, [markedDates]);

  // Template
  return (
    <>
      {/* Trigger */}
      <Surface style={styles.filterBtn} elevation={1}>
        <TouchableRipple
          borderless
          style={styles.filterBtn}
          onPress={handleShowModal}
        >
          <Icon
            size={22}
            color={markedDates.markedDates.startDate ? "#1B61B5" : "#404040"}
            source={"filter-variant"}
          />
        </TouchableRipple>
      </Surface>

      {/* Modal */}
      <Portal>
        <View
          style={[styles.container, { display: visible ? "flex" : "none" }]}
        >
          {/* <Calendar /> */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
              setVisible(!visible);
            }}
          >
            <View style={[styles.modalContainer]}>
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
                  markedDates={dates}
                  setMarkedDates={setDates}
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
                    onPress={handleClear}
                  >
                    Clear
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
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  filterBtn: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  modalContainer: {
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
