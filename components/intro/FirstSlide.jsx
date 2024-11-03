import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function FirstSlide({ width }) {
  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.logoWrapper}>
        <Image
          style={styles.logo}
          source={require("./../../assets/images/HomeHarmonyLogo.png")}
        ></Image>
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
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    gap: 20,
  },
  logoWrapper: {
    alignItems: "center", // Center items within logoWrapper
  },
  logo: {
    width: 150,
    height: 150,
  },
  logo_title: {
    fontFamily: "akaya-regular",
    fontSize: 30,
    color: Colors.PRIMARY,
    marginTop: 20,
  },
  desc_wrapper: {
    padding: 40,
  },
  desc: {
    fontFamily: "outfit-light",
    fontSize: 23,
    textAlign: "center",
  },
});
