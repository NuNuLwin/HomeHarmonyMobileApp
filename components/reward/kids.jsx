import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Colors from "./../../constants/Colors";
import FamilyMember from "../family/FamilyMember";

export default function kids() {
  const { userData, setUserData } = useContext(UserContext);
  console.log("from kids..", userData);

  const selectProfile = (profile) => {
    // setUserData((prevData) => ({
    //   ...prevData,
    //   currentUser: profile.name,
    // }));
    // router.replace("/chore");
  };
  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        {userData?.kids?.map((kid, index) => (
          <FamilyMember key={index} member={kid} onSelect={selectProfile} />
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
