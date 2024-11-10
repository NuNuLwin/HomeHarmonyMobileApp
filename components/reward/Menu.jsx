import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "./../../constants/Colors";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Menu({ handleRewardMenuClick }) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={handleRewardMenuClick}>
        <Text style={styles.title}>Reward</Text>
        <View style={styles.box1}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/cup.png")}
          ></Image>
          <View>
            <Text style={[styles.box_text, styles.number]}>3</Text>
            <Text style={styles.box_text}>Rewards</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.box}>
        <Text style={styles.title}>Redeem</Text>
        <View style={styles.box1}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/rewards.png")}
          ></Image>
          <View>
            <Text style={[styles.box_text, styles.number]}>3</Text>
            <Text style={styles.box_text}>Redeemed</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 10 },
  box: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_BLUE,
    padding: 15,
    gap: 10,
  },
  title: {
    color: Colors.SHADE_BLUE,
    fontFamily: "outfit-bold",
    fontSize: 18,
  },
  box1: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  img: {
    width: 50,
    height: 50,
  },
  box_text: {
    color: Colors.SHADE_BLUE,
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  number: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
