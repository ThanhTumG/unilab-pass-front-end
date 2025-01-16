import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {};

const HomeScreen = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text>home</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {},
});
