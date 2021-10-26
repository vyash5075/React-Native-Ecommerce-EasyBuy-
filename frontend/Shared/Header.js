import React from "react";
import { StyleSheet, Image, SafeAreaView, View } from "react-native";
const Header = () => {
  return (
    <SafeAreaView style={styles.header}>
      <Image
        source={require("../assets/logo1.png")}
        resizeMode="contain"
        style={{ height: 50 }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    padding: 10,
    paddingBottom: 0,
    //backgroundColor: "green",
  },
});

export default Header;
