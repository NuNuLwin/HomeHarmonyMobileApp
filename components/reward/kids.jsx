import { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

// context
import { useUserProvider } from "../../contexts/UserContext";

// components
import FamilyMember from "../family/FamilyMember";

// constants
import Colors from "./../../constants/Colors";

export default function kids({ onSelect, selectedKid, showPoint, currentRole }) {
  const userData = useUserProvider();

  const selectProfile = (profile) => {
    onSelect(profile);
  };
  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        {currentRole === "parent"
          ? userData?.kids?.map((kid, index) => (
              <FamilyMember
                key={index}
                member={kid}
                onSelect={selectProfile}
                isSelected={selectedKid ? selectedKid.name === kid.name : false}
                showPoint={showPoint}
              />
            ))
          : currentRole === "kid" &&
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
