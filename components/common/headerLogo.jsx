import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

export default function headerLogo() {
  return (
    <View style={styles.logo_wrapper}>
      <Image
        style={styles.logo}
        source={require("./../../assets/images/HomeHarmonyLogo.png")}
      />
      <Text style={styles.logo_title}>HomeHarmony</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  logo_wrapper: {
    padding: 30,
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  logo: {
    width: 70,
    height: 70,
  },
  logo_title: {
    fontFamily: "akaya-regular",
    fontSize: 30,
    color: Colors.PRIMARY,
  },
});
