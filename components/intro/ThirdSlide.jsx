import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function ThirdSlide({ width }) {
  return (
    <View style={[styles.container, { width }]}>
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
      <Text style={styles.desc}>
        Celebrate together: Every moment counts on our family calendar!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    gap: 10,
  },
  logo_wrapper: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
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
    height: 300,
    maxHeight: "35%",
  },
  desc: {
    padding: 40,
    fontFamily: "outfit-light",
    fontSize: 20,
    textAlign: "center",
  },
});
