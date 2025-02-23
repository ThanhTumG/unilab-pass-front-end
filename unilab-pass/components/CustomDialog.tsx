// Core
import { StyleSheet } from "react-native";
import React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

// Types
type Props = {
  title?: string;
  content?: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => any;
};

// Component
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
        <Dialog.Icon icon="alert" />
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button onPress={onConfirm}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export { WarningDialog };

// Styles
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
});
