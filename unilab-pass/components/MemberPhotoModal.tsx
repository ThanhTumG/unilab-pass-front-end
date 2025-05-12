// Core
import React from "react";
import { StyleSheet, Platform, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { Image } from "expo-image";

// Types
type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  photoURL: string;
};

// Component
const MemberPhotoModal = ({ visible, setVisible, photoURL }: Props) => {
  const hideModal = () => {
    setVisible(false);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.containerStyle}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              photoURL ? photoURL : require("../assets/images/no-photo.jpg")
            }
            contentFit="cover"
            transition={150}
          />
        </View>
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
  imageContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
});
