import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

export default function Header() {
  return (
    <View style={styles.logo_wrapper}>
      <Image
        source={require("./../../assets/images/gift.png")}
        style={styles.img}
      />
      <Text style={styles.title}>Reward</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  img: {
    width: 50,
    height: 50,
  },
  logo_wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
});
