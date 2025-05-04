// Core
import React, { useCallback, useState } from "react";
import { Button, Divider, Snackbar, useTheme } from "react-native-paper";
import {
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// App
import { useAuthStore } from "stores";
import ScreenHeader from "components/ScreenHeader";
import { NotificationControllerApi, NotificationResponse } from "api/index";
import { useFocusEffect } from "expo-router";
import NoticeItem from "components/NoticeItem";
import EmptyIcon from "components/ui/EmptyIcon";

// Types
type Props = {};

// Component
const NotificationScreen = (props: Props) => {
  // States
  const [notList, setNotList] = useState<NotificationResponse[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isPendingGetNot, setIsPendingGetNot] = useState(false);
  const [isPendingDelNot, setIsPendingDelNot] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Theme
  const theme = useTheme();

  // Store

  // Server
  const notificationControllerApi = new NotificationControllerApi();

  // Methods
  // Handle get all notification
  const handleGetAllNotification = async () => {
    if (isPendingGetNot) return;
    setIsPendingGetNot(true);
    const { appToken } = useAuthStore.getState();
    try {
      const response = await notificationControllerApi.getMyNotifications({
        headers: { Authorization: `Bearer ${appToken}` },
      });

      console.log(response.data.result);
      setNotList(response.data.result);
    } catch (err: any) {
      if (err.response) {
        setAlertMessage(err.response.data.message);
        setIsAlert(true);
      }
    }
    setIsPendingGetNot(false);
  };

  // Handle delete notification
  const handleDelNotification = async () => {
    if (isPendingDelNot) return;
    setIsPendingDelNot(true);
    const { appToken } = useAuthStore.getState();

    try {
      await notificationControllerApi.deleteNotification(
        { id: selectedId },
        { headers: { Authorization: `Bearer ${appToken}` } }
      );
      setModalVisible(false);
      handleGetAllNotification();
      setAlertMessage("Successfully delete notification");
      setIsAlert(true);
    } catch (err: any) {
      if (err.response) {
        setAlertMessage(err.response.data.message);
        setIsAlert(true);
      }
    }
    setIsPendingDelNot(false);
  };

  // Handle show modal
  const handleShowModal = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  // Handle refresh
  const onRefresh = useCallback(() => {
    handleGetAllNotification();
  }, [handleGetAllNotification]);

  // Effects
  useFocusEffect(
    useCallback(() => {
      handleGetAllNotification();
    }, [])
  );

  // Template
  return (
    <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
      {/* Header */}
      <ScreenHeader title="Notification" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isPendingGetNot || isPendingDelNot}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.container}>
          {notList &&
            notList.map((item) => (
              <NoticeItem
                key={item.id}
                item={item}
                onPress={() => handleShowModal(item.id ?? "")}
              />
            ))}

          {notList && notList.length === 0 && <EmptyIcon />}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Button
                rippleColor={"transparent"}
                style={styles.btnContainer}
                contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
                icon={"delete-outline"}
                onPress={handleDelNotification}
              >
                Delete Notification
              </Button>
              <Divider style={{ width: "100%", height: 1 }} />
              <Button
                rippleColor={"transparent"}
                style={styles.btnContainer}
                contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
                icon={"window-close"}
                onPress={() => setModalVisible(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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

export default NotificationScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: "100%",
  },
  scrollView: {
    marginTop: 69,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1.2,
    borderColor: "#c6c6c6",
    paddingVertical: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  btnContainer: {
    alignSelf: "stretch",
    borderRadius: 0,
  },
  btnContent: {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingVertical: 4,
  },
  btnLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#333",
  },
});
