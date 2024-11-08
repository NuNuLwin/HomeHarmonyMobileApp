import { Redirect } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import IntroScreen from "./intro/index";
import { auth } from "./../config/FirebaseConfig";

export default function Index() {
  const user = auth.currentUser;
  return (
    <SafeAreaView style={styles.safeContainer}>
      {user ? <Redirect href={"/chore"} /> : <IntroScreen />}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
