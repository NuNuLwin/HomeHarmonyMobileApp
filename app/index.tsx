import { Link } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import IntroScreen from "./intro/index";

export default function Index() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <IntroScreen />
      {/* <Link href={"/signup"}>
        <Text>Go to Login screen</Text>
      </Link> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
