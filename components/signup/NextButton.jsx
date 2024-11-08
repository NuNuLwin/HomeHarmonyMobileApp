import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function NextButton(props) {
  const router = useRouter();
  return (
    <View style={styles.btn}>
      <TouchableOpacity onPress={props.onPressed}>
        <AntDesign name="arrowright" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "15%",
    alignItems: "center",
    borderRadius: 30,
    padding: 10,
    marginTop: 20,
    backgroundColor: "#E26868",
    borderRadius: 30,
    alignSelf: "flex-end",
  },
});
