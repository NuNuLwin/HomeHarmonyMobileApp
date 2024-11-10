import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React, { useContext } from "react";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
//components
import FamilyMember from "../../components/family/FamilyMember";
//context
import { UserContext } from "../../contexts/UserContext";

export default function family() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);

  const selectProfile = (profile) => {
    setUserData((prevData) => ({
      ...prevData,
      selectedProfile: profile,
    }));
    router.push({ pathname: "/family/profile" });
  };

  return (
    <View>
      <ImageBackground
        style={styles.img}
        source={require("./../../assets/images/family.jpg")}
      >
        <Text style={styles.title}>
          Welcome From {userData.currentUser}'s Family!
        </Text>
      </ImageBackground>

      <View style={styles.member_box}>
        <View style={styles.body_wrapper}>
          {userData?.parents?.map((parent, index) => (
            <FamilyMember
              key={index}
              member={parent}
              onSelect={selectProfile}
            />
          ))}
          {userData?.kids?.map((kid, index) => (
            <FamilyMember key={index} member={kid} onSelect={selectProfile} />
          ))}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 450,
  },
  title: {
    position: "absolute",
    top: 100,
    left: 40,
    fontSize: 20,
    fontFamily: "outfit-bold",
  },

  member_box: {
    flexWrap: "wrap",
    backgroundColor: Colors.WHITE,
    marginTop: -30,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  body_wrapper: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
