import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "./../../config/FirebaseConfig";
import { TouchableOpacity } from "react-native";

export default function family() {
  console.log(auth.currentUser);
  return (
    <View>
      <Image
        style={styles.img}
        source={require("./../../assets/images/family.jpg")}
      />
      <View></View>
      <TouchableOpacity style={styles.profileCircle}>
        <Ionicons name="person" size={24} color="black" />
      </TouchableOpacity>
      {/* <Text>Welcome to {username}</Text> */}
      <View style={styles.member_box}>
        <Text style={styles.text}>Members</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 450,
  },
  member_box: {
    backgroundColor: Colors.WHITE,
    marginTop: -30,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  text: {
    fontSize: 26,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
  profileCircle: {
    borderWidth: 1,
    borderRadius: 40,
    position: "absolute",
    top: 50,
    left: 40,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.GREY,
    backgroundColor: Colors.WHITE,
  },
});
