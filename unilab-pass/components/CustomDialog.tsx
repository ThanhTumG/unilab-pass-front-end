// Core
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Divider,
  Icon,
  Portal,
  Text,
} from "react-native-paper";

// Types
type Props = {
  title?: string;
  content?: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => any;
  onCloseDialog?: () => any;
};

// Component
// Warn Dialog
const WarningDialog = ({
  visible,
  setVisible,
  title,
  content,
  onConfirm,
}: Props) => {
  const hideDialog = () => setVisible(false);

  // Template
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <View style={styles.header}>
          <Text style={styles.title} variant="titleMedium">
            {title}
          </Text>
          <Icon source={"alert"} size={22} color="#ff7733" />
        </View>
        <Divider />
        <Dialog.Content style={styles.content}>
          <Text style={styles.contentText} variant="bodyMedium">
            {content}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            contentStyle={styles.btn}
            onPress={hideDialog}
            labelStyle={[styles.label, { color: "#333" }]}
          >
            Cancel
          </Button>
          <Button
            contentStyle={styles.btn}
            labelStyle={[styles.label]}
            onPress={onConfirm}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

// Error Dialog
const ErrorDialog = ({
  visible,
  setVisible,
  title,
  content,
  onConfirm,
  onCloseDialog,
}: Props) => {
  const hideDialog = () => {
    setVisible(false);
    onCloseDialog && onCloseDialog();
  };

  // Template
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <View style={styles.header}>
          <Text style={styles.title} variant="titleMedium">
            {title}
          </Text>
          <Icon source={"close-circle"} size={22} color="#ff6666" />
        </View>
        <Divider />
        <Dialog.Content style={styles.content}>
          <Text style={styles.contentText} variant="bodyMedium">
            {content}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            contentStyle={styles.btn}
            onPress={hideDialog}
            labelStyle={[styles.label, { color: "#333" }]}
          >
            Cancel
          </Button>
          <Button
            contentStyle={styles.btn}
            labelStyle={[styles.label]}
            onPress={onConfirm}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

// Success Dialog
const SuccessDialog = ({
  visible,
  setVisible,
  title,
  content,
  onCloseDialog,
}: Props) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible) {
      timer = setTimeout(() => {
        setVisible(false);
        onCloseDialog && onCloseDialog();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [visible]);

  // Template
  return (
    <Portal>
      <Dialog visible={visible}>
        <View style={styles.header}>
          <Text style={styles.title} variant="titleMedium">
            {title}
          </Text>
          <Icon source={"check-circle"} size={22} color="#3bb300" />
        </View>
        <Divider />
        {content && (
          <Dialog.Content style={styles.content}>
            <Text style={styles.contentText} variant="bodyMedium">
              {content}
            </Text>
          </Dialog.Content>
        )}
      </Dialog>
    </Portal>
  );
};

export { WarningDialog, ErrorDialog, SuccessDialog };

// Styles
const styles = StyleSheet.create({
  title: {
    textAlign: "left",
    fontFamily: "Poppins-Medium",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 4,
    paddingHorizontal: 22,
    paddingBottom: 10,
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  btn: {
    maxWidth: 80,
    paddingHorizontal: 3,
  },
  content: {
    paddingTop: 15,
  },
  contentText: {
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
});
