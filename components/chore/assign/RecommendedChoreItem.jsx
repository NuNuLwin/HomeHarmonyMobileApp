import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../../../constants/Colors";

export default function RecommendedChoreItem({ chore }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: chore.image }}
        style={styles.img}
        onError={(error) =>
          console.log("Image load error:", error.nativeEvent.error)
        }
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.text, { fontSize: 16 }]}>{chore.name}</Text>
        <View style={styles.point_container}>
          <Image
            source={require("./../../../assets/images/coin.png")}
            style={styles.img1}
          />
          <Text style={[styles.text, { color: Colors.GREY }]}>
            {chore.point} pts
          </Text>
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
  point: {
    backgroundColor: "#F49B9B",
    borderRadius: 20,
    borderColor: "#E26868",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  btnContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  btn: {
    backgroundColor: "#92D6FA",
    borderColor: "#44BEFF",
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
  },
  text: { fontFamily: "outfit-regular", fontSize: 14 },
});
