import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import Colors from "./../../constants/Colors";
import FamilyMember from "../family/FamilyMember";

export default function kids({ onSelect, selectedKid }) {
  const { userData, setUserData } = useContext(UserContext);

  console.log("=== kids = selectedKid ===", selectedKid);

  const selectProfile = (profile) => {
    onSelect(profile);
  };
  return (
    <ScrollView horizontal={true} style={{ height: 150 }}>
      <View style={styles.container}>
        {userData?.kids?.map((kid, index) => (
          <FamilyMember
            key={index}
            member={kid}
            onSelect={selectProfile}
            isSelected={selectedKid ? selectedKid.name === kid.name : false}
            showPoint={true}
          />
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
