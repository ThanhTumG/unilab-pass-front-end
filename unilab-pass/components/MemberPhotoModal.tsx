// Core
import React from "react";
import { Image, StyleSheet } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";

// Types
type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  photoURL: string;
};

// Component
const MemberPhotoModal = ({ visible, setVisible, photoURL }: Props) => {
  const hideModal = () => setVisible(false);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.containerStyle}
      >
        <Image
          style={styles.image}
          source={
            photoURL
              ? { uri: photoURL }
              : require("../assets/images/no-photo.jpg")
          }
        />
      </Modal>
    </Portal>
  );
};

export default MemberPhotoModal;

// Styles
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 17,
    width: "90%",
    maxHeight: "70%",
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
});
