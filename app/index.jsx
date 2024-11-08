import { Redirect } from "expo-router";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import IntroScreen from "./intro/index";
import { auth } from "../config/FirebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Colors from "@/constants/Colors";

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        setUser(_user);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {user ? <Redirect href={"/chore"} /> : <IntroScreen />}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: Colors.WHITE,
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
