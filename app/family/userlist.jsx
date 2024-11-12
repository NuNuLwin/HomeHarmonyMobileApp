import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../../config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserContext } from "../../contexts/UserContext";
import { useRouter } from "expo-router";
import HeaderLogo from "../../components/common/headerLogo";
import FamilyMember from "../../components/family/FamilyMember";
import Colors from "../../constants/Colors";

export default function Userlist() {
  const { userData, setUserData } = useContext(UserContext);
  const router = useRouter();

  const selectProfile = (profile) => {
    setUserData((prevData) => ({
      ...prevData,
      currentUser: profile.name,
      currentRole: profile.role,
    }));
    router.replace("/chore");
  };

  useEffect(() => {
    GetFamily();
  }, []);

  /**
   * Used to Get family member List from DB
   */
  const GetFamily = async () => {
    const q = query(
      collection(db, "Families"),
      where("email", "==", auth.currentUser.email)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setUserData(doc.data());
    });
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <HeaderLogo />
        <Text style={styles.title}>Who are you?</Text>
        <View style={styles.body_wrapper}>
          {userData?.parents?.map((parent, index) => (
            <FamilyMember
              key={index}
              member={{ ...parent, role: "parent" }}
              onSelect={selectProfile}
              showPoint={false}
            />
          ))}
          {userData?.kids?.map((kid, index) => (
            <FamilyMember
              key={index}
              member={{ ...kid, role: "kid" }}
              onSelect={selectProfile}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 40,
  },

  title: {
    marginTop: 30,
    fontSize: 25,
    fontFamily: "outfit-regular",
  },
  body_wrapper: {
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
