import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "./../../config/FirebaseConfig";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

//components
import Members from "./../../components/family/members";

export default function family() {
  const router = useRouter();

  return (
    <View>
      <ImageBackground
        style={styles.img}
        source={require("./../../assets/images/family.jpg")}
      >
        <TouchableOpacity
          style={styles.profileCircle}
          onPress={() => router.push({ pathname: "/family/profile" })}
        >
          <Ionicons name="person" size={24} color="black" />
        </TouchableOpacity>
      </ImageBackground>

      <Members />

      {/* <Text>Welcome to {username}</Text> */}
    </View>
  );
}
const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 450,
  },

  profileCircle: {
    borderWidth: 1,
    borderRadius: 40,
    position: "absolute",
    top: 50,
    left: 40,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.GREY,
    backgroundColor: Colors.WHITE,
  },
});
