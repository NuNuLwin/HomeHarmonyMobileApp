import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../../../constants/Colors";
import { router, useRouter } from "expo-router";

export default function Menu() {
  const router = useRouter();

  const handlePendingMenuClick = () => {
    router.push({ pathname: "/chore/assignChore" });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pending_box}
        onPress={handlePendingMenuClick}
      >
        <View>
          <Text>Assign/</Text>
          <Text>Pending</Text>
        </View>
        <MaterialIcons
          name="pending-actions"
          size={25}
          color={"#802828"}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.approval_box}>
        <Text>Approve</Text>
        {/* <MaterialIcons
          name="approval"
          size={25}
          color={"#1676D6"}
          style={styles.icon}
        /> */}
        <Image
          style={styles.img}
          source={require("./../../../assets/images/approval.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.completed_box}>
        <Text>Completed</Text>
        {/* <Ionicons
          name="checkmark-done-circle"
          size={25}
          color={"#3F9233"}
          style={styles.icon}
        /> */}
        <Image
          style={[styles.img, { width: 20, height: 25 }]}
          source={require("./../../../assets/images/completed.png")}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  pending_box: {
    backgroundColor: "#D3A5A5",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    gap: 10,
    flex: 1,
    alignItems: "center",
    height: 70,
    justifyContent: "space-between",
  },
  approval_box: {
    backgroundColor: "#D1E7FD",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    gap: 10,
    flex: 1,
    alignItems: "center",
    height: 70,
    justifyContent: "space-between",
  },
  completed_box: {
    backgroundColor: "#E1EFDF",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    gap: 10,
    flex: 1,
    alignItems: "center",
    height: 70,
    justifyContent: "space-between",
  },
  img: {
    width: 30,
    height: 30,
  },
});
