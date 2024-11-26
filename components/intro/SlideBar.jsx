import { View, StyleSheet } from "react-native";
import React from "react";

export default function SlideBar({ currentPage }) {
  return (
    <View style={styles.paginationWrapper}>
      {Array.from(Array(3).keys()).map((key, index) => (
        <View
          style={
            index === currentPage
              ? styles.paginationDotsActive
              : styles.paginationDots
          }
          key={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  paginationWrapper: {
    paddingBottom: 40,
    flexDirection: "row",
    display: "flex",
  },
  paginationDotsActive: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: "#817F7F",
    marginLeft: 10,
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: "#BEB9B9",
    marginLeft: 10,
  },
});
