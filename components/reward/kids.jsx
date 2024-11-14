import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import Colors from "./../../constants/Colors";
import FamilyMember from "../family/FamilyMember";

export default function kids({ onSelect, selectedKid, showPoint }) {
  const { userData, setUserData } = useContext(UserContext);

  const selectProfile = (profile) => {
    onSelect(profile);
  };
  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        {userData?.currentRole === "parent"
          ? userData?.kids?.map((kid, index) => (
              <FamilyMember
                key={index}
                member={kid}
                onSelect={selectProfile}
                isSelected={selectedKid ? selectedKid.name === kid.name : false}
                showPoint={showPoint}
              />
            ))
          : userData?.currentRole === "kid" &&
            selectedKid && (
              <FamilyMember
                key={selectedKid.name} // or use a unique identifier like ID
                member={selectedKid}
                onSelect={selectProfile}
                isSelected={true}
                showPoint={true}
              />
            )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
