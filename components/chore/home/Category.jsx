import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

// router
import { useRouter } from "expo-router";

// icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// constants
import Colors from "../../../constants/Colors";
import Keys from "../../../constants/Keys";

export default function Category({ category, currentRole }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(Keys.PENDING);

  const handlePendingClick = () => {
    router.push({ pathname: "/chore/assignChore" });
  };

  console.log("========selectedCategory=======", selectedCategory);

  return (
    <View style={styles.container}>
      {/* Circle 1: Pending */}
      <View style={styles.circleContainer}>
        <TouchableOpacity
          style={[
            selectedCategory === Keys.PENDING
              ? styles.circleSelected
              : styles.circle,
            { backgroundColor: Colors.CHORE_COLORS.PENDING },
          ]}
          onPress={() => {
            setSelectedCategory(Keys.PENDING);
            category(Keys.PENDING);
          }}
        >
          <MaterialIcons
            name="hourglass-empty"
            size={25}
            color={Colors.CHORE_COLORS.PENDING_ICON}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{Keys.PENDING}</Text>
      </View>

      {/* Circle 2: In-Progress */}
      <View style={styles.circleContainer}>
        <TouchableOpacity
          style={[
            selectedCategory === Keys.IN_PROGRESS
              ? styles.circleSelected
              : styles.circle,
            { backgroundColor: Colors.CHORE_COLORS.IN_PROGRESS },
          ]}
          onPress={() => {
            setSelectedCategory(Keys.IN_PROGRESS);
            category(Keys.IN_PROGRESS);
          }}
        >
          <MaterialIcons
            name="approval"
            size={25}
            color={Colors.CHORE_COLORS.IN_PROGRESS_ICON}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{Keys.IN_PROGRESS}</Text>
      </View>

      {/* Circle 3: Completed */}
      <View style={styles.circleContainer}>
        <TouchableOpacity
          style={[
            selectedCategory === Keys.COMPLETED
              ? styles.circleSelected
              : styles.circle,
            { backgroundColor: Colors.CHORE_COLORS.COMPLETED },
          ]}
          onPress={() => {
            setSelectedCategory(Keys.COMPLETED);
            category(Keys.COMPLETED);
          }}
        >
          <MaterialIcons
            name="check-circle-outline"
            size={30}
            color={Colors.CHORE_COLORS.COMPLETED_ICON}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{Keys.COMPLETED}</Text>
      </View>

      {/* Circle 4: Assign */}
      {currentRole === "parent" && (
        <View style={styles.circleContainer}>
          <TouchableOpacity
            style={[
              styles.circle,
              { backgroundColor: Colors.CHORE_COLORS.ASSIGN },
            ]}
            onPress={() => {
              setSelectedCategory(Keys.PENDING);
              handlePendingClick();
            }}
          >
            <MaterialIcons
              name="pending-actions"
              size={25}
              color={Colors.CHORE_COLORS.ASSIGND_ICON}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.text}>Assign</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    padding: 20,
    marginTop: 55,
  },
  circleContainer: {
    alignItems: "center",
  },
  circle: {
    borderRadius: 50,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  circleSelected: {
    borderRadius: 50,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderColor: Colors.SHADE_BLUE,
    borderWidth: 4,
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
