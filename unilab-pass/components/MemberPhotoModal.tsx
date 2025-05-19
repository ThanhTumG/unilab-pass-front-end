// Core
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";

// Types
type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  photoURL: string;
};

// Component
const MemberPhotoModal = ({ visible, setVisible, photoURL }: Props) => {
  // States
  const [localUri, setLocalUri] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const hideModal = () => {
    setVisible(false);
    setLocalUri(undefined);
  };

  // Effects
  useEffect(() => {
    console.log(photoURL);
    const downloadAndCacheImage = async () => {
      if (!photoURL) return;

      try {
        setIsLoading(true);
        // Tạo tên file duy nhất từ URL
        const filename = photoURL.split("/").pop() || "image.jpg";
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;

        // Kiểm tra xem file đã tồn tại trong cache chưa
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (fileInfo.exists) {
          console.log("Using cached image");
          setLocalUri(fileUri);
          setIsLoading(false);
          return;
        }

        // Tải ảnh và lưu vào cache
        console.log("Downloading image...");
        const downloadResult = await FileSystem.downloadAsync(
          photoURL,
          fileUri
        );

        if (downloadResult.status === 200) {
          console.log("Image downloaded successfully");
          setLocalUri(downloadResult.uri);
        } else {
          console.log("Download failed");
          setLocalUri(undefined);
        }
      } catch (error) {
        console.log("Error downloading image:", error);
        setLocalUri(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    if (visible && photoURL) {
      downloadAndCacheImage();
    }

    return () => {
      setLocalUri(undefined);
    };
  }, [visible, photoURL]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.containerStyle}
      >
        <View style={styles.imageContainer}>
          {isLoading ? (
            <ActivityIndicator animating={true} />
          ) : localUri ? (
            <Image
              style={styles.image}
              source={localUri}
              contentFit="contain"
              transition={300}
              cachePolicy="memory-disk"
            />
          ) : (
            <Image
              style={styles.image}
              source={require("../assets/images/no-photo.jpg")}
              contentFit="contain"
              transition={300}
              cachePolicy="memory-disk"
            />
          )}
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
    height: "100%",
  },
});
