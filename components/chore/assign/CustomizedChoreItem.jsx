import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../../../constants/Colors";

export default function CustomizedChoreItem({ chore }) {
  return (
    <View style={styles.card}>
      <Image
        style={styles.img}
        source={require("./../../../assets/images/to-do-list.png")}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.text, { fontSize: 16 }]}>{chore.name}</Text>
        <View style={styles.point_container}>
          <Image
            source={require("./../../../assets/images/coin.png")}
            style={styles.img1}
          />
          <Text style={styles.text}>{chore.point} pts</Text>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <View style={styles.btn}>
          <Text style={styles.text}>Add Chore</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  img1: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  infoContainer: {
    flex: 1,
  },
  point_container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 5,
  },
  btnContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  btn: {
    backgroundColor: Colors.PINK,
    borderColor: Colors.PINK,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: "outfit-regular",
    fontSize: 14,
  },
});
