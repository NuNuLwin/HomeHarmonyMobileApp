import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ThirdSlide() {
  return (
    <View style={[styles.container]}>
      <View style={styles.logo_wrapper}>
        <Image
          style={styles.logo}
          source={require("./../../assets/images/HomeHarmonyLogo.png")}
        ></Image>
        <Text style={styles.logo_title}>HomeHarmony</Text>
      </View>
      <Text style={styles.slider_title}>Gather, celebrate, and cherish.</Text>
      <Image
        style={styles.slider_img}
        source={require("./../../assets/images/intro2.jpg")}
      ></Image>

      <View style={styles.desc_wrapper}>
        <Text style={styles.desc}>
          Celebrate together: Every moment counts on our family calendar!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    gap: 20,
    width: screenWidth,
  },
  logo_wrapper: {
    height: (2 / 14) * screenHeight,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  logo: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
  },
  logo_title: {
    fontFamily: "akaya-regular",
    fontSize: 20,
    color: Colors.PRIMARY,
  },
  slider_title: {
    fontFamily: "outfit-regular",
    fontSize: 20,
  },
  slider_img: {
    width: "100%",
    height: screenHeight * 0.27,
    resizeMode: "contain",
  },
  desc_wrapper: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  desc: {
    fontFamily: "outfit-light",
    fontSize: screenWidth * 0.05,
    textAlign: "center",
  },
});
