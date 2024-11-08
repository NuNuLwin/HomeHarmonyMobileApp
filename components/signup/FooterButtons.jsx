import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// icons
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FooterButtons({
  showBackButton,
  handleBackButtonClicked,
  showNextButton,
  handleNextButtonClicked,
}) {
  return (
    <View
      style={
        showNextButton && showBackButton
          ? styles.btnWrapper
          : !showNextButton && showBackButton
          ? styles.btnWrapperBack
          : styles.btnWrapperNext
      }
    >
      <TouchableOpacity
        style={showBackButton ? styles.btn : styles.hideBtn}
        onPress={handleBackButtonClicked}
      >
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={showNextButton ? styles.btn : styles.hideBtn}
        onPress={handleNextButtonClicked}
      >
        <Ionicons name="arrow-forward" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  hideBtn: {
    display: "none",
  },
  btn: {
    width: 50,
    alignItems: "center",
    borderRadius: 30,
    padding: 10,
    marginTop: 20,
    backgroundColor: "#E26868",
    borderRadius: 30,
  },
  btnWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnWrapperBack: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  btnWrapperNext: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
