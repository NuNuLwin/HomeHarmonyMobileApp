import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

export default function FamilyMember({ member, onSelect }) {
  return (
    <TouchableOpacity style={styles.img_box} onPress={() => onSelect(member)}>
      <View style={styles.img_wrapper}></View>
      <Text style={styles.text}>{member.name}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  img_box: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  img_wrapper: {
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.GREY,
    backgroundColor: Colors.LIGHT_GREY,
    alignSelf: "center",
  },
  text: {
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
});
