import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../../config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserContext } from "../../contexts/UserContext";
import { useRouter } from "expo-router";
import HeaderLogo from "../../components/common/headerLogo";
import FamilyMember from "../../components/family/FamilyMember";

export default function Userlist() {
  const { userData, setUserData } = useContext(UserContext);
  const [family, setFamily] = useState({});
  const router = useRouter();

  const selectProfile = (profile) => {
    setUserData(profile);
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
      setFamily(doc.data());
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderLogo />
      <Text style={styles.title}>Who are you?</Text>
      <View style={styles.body_wrapper}>
        {family?.parents?.map((parent, index) => (
          <FamilyMember key={index} member={parent} onSelect={selectProfile} />
        ))}
        {family?.kids?.map((kid, index) => (
          <FamilyMember key={index} member={kid} onSelect={selectProfile} />
        ))}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },

  title: {
    marginTop: 30,
    fontSize: 25,
    fontFamily: "outfit-regular",
  },
  body_wrapper: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
