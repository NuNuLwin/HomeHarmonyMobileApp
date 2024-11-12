import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useContext } from "react";
import { Image } from "react-native";
import KidInfo from "./KidInfo";
import { UserContext } from "../../../contexts/UserContext";
import Menu from "./Menu";

export default function Header() {
  const { userData } = useContext(UserContext);
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        {userData?.kids?.map((kid, index) => (
          <KidInfo key={index} kid={kid} />
        ))}
      </ScrollView>

      <Menu />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 15,
    padding: 10,
    marginTop: -30,
  },
});
