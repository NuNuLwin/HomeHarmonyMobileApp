import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Colors from "./../../constants/Colors";

export default function FamilyMember({
  member,
  onSelect,
  showPoint,
  isSelected,
}) {
  console.log("=== FamilyMember ===", isSelected);

  return (
    <TouchableOpacity style={styles.img_box} onPress={() => onSelect(member)}>
      <View style={styles.img_wrapper}>
        <Image
          source={{ uri: member.image }}
          style={[styles.profile_img, isSelected && styles.selectedBorder]}
          onError={(error) =>
            console.log("Image load error:", error.nativeEvent.error)
          }
        />
      </View>
      {showPoint && member.point !== null && member.point !== undefined ? (
        <View style={styles.point_box}>
          <Text style={styles.point_text}>{member.point}</Text>
        </View>
      ) : null}
      <Text style={styles.text}>{member.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  img_box: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 5,
  },
  img_wrapper: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    backgroundColor: Colors.LIGHT_GREY,
    alignSelf: "center",
  },
  text: {
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  profile_img: {
    flex: 1,
    borderRadius: 50,
  },
  point_box: {
    width: 55,
    borderRadius: 10,
    backgroundColor: Colors.ORANGE,
    alignItems: "center",
  },
  point_text: {
    fontFamily: "outfit-regular",
    fontSize: 14,
  },
  selectedBorder: {
    borderWidth: 3,
    borderColor: Colors.GREY,
  },
});
