import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

// Icon
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BackButton(props) {
  const router = useRouter();
  return (
    <View>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
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
