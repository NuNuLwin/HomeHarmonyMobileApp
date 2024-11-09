import { View, Text, SafeAreaView, StyleSheet, Button } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import { getAuth, signOut } from "firebase/auth";

export default function Profile() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Profile",
      headerBackTitle: "Family",
    });
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully!");
        navigation.replace("Login"); // Navigate to the login screen
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
  },
});
