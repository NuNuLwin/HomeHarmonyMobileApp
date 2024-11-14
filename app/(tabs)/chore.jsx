import { View, Text, SafeAreaView, StyleSheet, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { TouchableOpacity } from "react-native";
import { auth } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import Header from "../../components/chore/home/Header";
import Colors from "./../../constants/Colors";
import Category from "../../components/chore/home/Category";
import AssignChoreList from "../../components/chore/home/AssignChoreList";

export default function chore() {
  const { userData, setUserData } = useContext(UserContext);
  useEffect(() => {
    console.log("From Chorre..", userData.currentUser);
  }, []);
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: Colors.WHITE }}>
      {/* <Image
        style={styles.img}
        source={require("./../../assets/images/chore.jpg")}
      /> */}

      <View style={styles.container}>
        <Text>Hello {userData.currentUser}</Text>
        <Header />
        <AssignChoreList />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    // gap: 10,
  },
  img: {
    width: "100%",
    height: 150,
  },
});
