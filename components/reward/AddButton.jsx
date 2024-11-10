import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import Colors from "../../constants/Colors";

export default function AddButton({ handleAddReward }) {
  return (
    <View style={styles.btnWrapper}>
      <TouchableOpacity style={styles.btn} onPress={handleAddReward}>
        <Feather name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btnWrapper: {
    position: "absolute",
    bottom: 60,
    right: 20,
  },
  btn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: Colors.RED_PINK,
  },
});
