import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ButtonGroup() {
  const router = useRouter();
  return (
    <View style={styles.introButtonGroup}>
      <TouchableOpacity
        style={styles.introButton}
        onPress={() => router.push("auth/sign-in")}
      >
        <Text style={styles.introButtonText}>Join Family</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.introButton}
        onPress={() => router.push("auth/sign-up")}
      >
        <Text style={styles.introButtonText}>New Family</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  introButtonGroup: {
    paddingBottom: 20,
    width: "80%",
  },
  introButton: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#E26868",
    color: "#fff",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  introButtonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "outfit-regular",
  },
});
