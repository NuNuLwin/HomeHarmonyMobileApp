import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function loading() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Please Wait...</Text> */}
      <Text style={styles.text}>Your family account is creating</Text>
      <ActivityIndicator size={"large"} color={Colors.PRIMARY} />
      <Text style={styles.text1}>Don't Go Back</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 35,
    textAlign: "center",
  },
  text: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },

  text1: {
    fontSize: 20,
    color: Colors.GREY,
    marginTop: 20,
    fontFamily: "outfit-light",
  },
});
