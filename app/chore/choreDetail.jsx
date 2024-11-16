import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function choreDetail() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Detail",
      headerBackTitle: "Home",
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.left_box}>
            <Text style={styles.text_medium}>30 Pts</Text>
          </View>
          <View style={styles.right_box}>
            <Text>BiBi</Text>
          </View>
        </View>

        <View style={styles.img_wrapper}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/table.png")}
          />
          <Text style={[styles.text, { fontSize: 20 }]}>Clean table</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={styles.detail_box}>
            <Text style={styles.text}>13-15 yrs</Text>
          </View>
          <View style={styles.detail_box}>
            <Text style={styles.text}>Recommended</Text>
          </View>
        </View>

        <View style={{ gap: 10, paddingTop: 20, paddingBottom: 30 }}>
          <Text style={[styles.text_medium, { fontSize: 16 }]}>
            Attach photo for Approval
          </Text>
          <TouchableOpacity style={styles.camera_box}>
            <Ionicons name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            gap: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={[styles.btn, { backgroundColor: Colors.GREEN }]}>
            <Text style={[styles.text, styles.btn_text]}>Complete</Text>
          </View>
          <View style={[styles.btn, { backgroundColor: Colors.RED }]}>
            <Text style={[styles.text, styles.btn_text]}>Reject</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left_box: {
    padding: 3,
    backgroundColor: Colors.PINK,
    paddingHorizontal: 10,
  },
  right_box: {
    padding: 3,
    alignItems: "flex-end",
  },
  img_wrapper: {
    alignItems: "center",
    gap: 20,
  },
  img: {
    width: 200,
    height: 200,
  },
  text: {
    fontFamily: "outfit-regular",
  },
  text_medium: {
    fontFamily: "outfit-medium",
  },
  detail_box: {
    backgroundColor: Colors.LIGHT_BLUE,
    borderRadius: 20,
    padding: 3,
    paddingHorizontal: 10,
  },
  camera_box: {
    backgroundColor: Colors.LIGHT_GREY,
    padding: 20,
    alignItems: "center",
    width: "20%",
    borderRadius: 10,
  },
  btn: {
    borderRadius: 20,
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 30,
    flex: 1,
    alignItems: "center",
  },
  btn_text: {
    color: Colors.WHITE,
    fontFamily: "outfit-medium",
    fontSize: 15,
  },
});
