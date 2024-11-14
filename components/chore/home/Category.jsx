import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function Category({ category }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState();

  const handlePendingClick = () => {
    router.push({ pathname: "/chore/assignChore" });
  };

  return (
    <View style={styles.container}>
      {/* Circle 1: Pending */}
      <View style={styles.circleContainer}>
        <TouchableOpacity
          style={[styles.circle, { backgroundColor: "#D3A5A5" }]}
          onPress={() => {
            setSelectedCategory("Pending");
            category("Pending");
          }}
        >
          <MaterialIcons name="hourglass-empty" size={25} color={"#802828"} />
          {/* <MaterialIcons name="pending-actions" size={30} color={"#802828"} /> */}
        </TouchableOpacity>
        <Text style={styles.text}>Pending</Text>
      </View>

      {/* Circle 2: Approval */}
      <View style={styles.circleContainer}>
        <TouchableOpacity
          style={[styles.circle, { backgroundColor: "#D1E7FD" }]}
          onPress={() => {
            setSelectedCategory("Approval");
            category("Approval");
          }}
        >
          <MaterialIcons
            name="approval"
            size={25}
            color={"#0055A4"}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.text}>Approve</Text>
      </View>

      {/* Circle 3: Completed */}
      <View style={styles.circleContainer}>
        <TouchableOpacity
          style={[styles.circle, { backgroundColor: "#E1EFDF" }]}
          onPress={() => {
            setSelectedCategory("Completed");
            category("Completed");
          }}
        >
          <MaterialIcons
            name="check-circle-outline"
            size={30}
            color={"#28A745"}
          />
        </TouchableOpacity>
        <Text style={styles.text}>Completed</Text>
      </View>

      {/* Circle 4: In Progress */}
      <View style={styles.circleContainer}>
        <TouchableOpacity
          style={[styles.circle, { backgroundColor: "#ffd5d3" }]}
          onPress={() => {
            setSelectedCategory("Assign");
            handlePendingClick();
          }}
        >
          <MaterialIcons
            name="pending-actions"
            size={25}
            color={"#724040"}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.text}>Assign</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    padding: 20,
  },
  circleContainer: {
    alignItems: "center",
  },
  circle: {
    backgroundColor: "#D3D3D3",
    borderRadius: 50,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
    fontFamily: "outfit-regular",
  },
  img: {
    width: 30,
    height: 30,
  },
});
