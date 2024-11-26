import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function FirstSlide() {
  return (
    <View style={[styles.container]}>
      <View style={styles.logoWrapper}>
        <Image
          style={styles.logo}
          source={require("./../../assets/images/HomeHarmonyLogo.png")}
        />
        <Text style={styles.logo_title}>HomeHarmony</Text>
      </View>

      <View style={styles.desc_wrapper}>
        <Text style={styles.desc}>
          Smart tasks, seamless events – making family life easier, one step at
          a time.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingVertical: 20,
    width: screenWidth,
  },
  logoWrapper: {
    alignItems: "center",
    height: (6 / 14) * screenHeight,
    justifyContent: "flex-end",
  },
  logo: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
  },
  logo_title: {
    fontFamily: "akaya-regular",
    fontSize: 30,
    color: Colors.PRIMARY,
    marginTop: 20,
  },
  desc_wrapper: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  desc: {
    fontFamily: "outfit-light",
    fontSize: screenWidth * 0.05,
    textAlign: "center",
    flexWrap: "wrap",
  },
});
