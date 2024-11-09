import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { auth, db } from "./../../config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function members() {
  console.log("Hello from member..", auth.currentUser.email);

  const [family, setFamily] = useState({});

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
    <View style={styles.member_box}>
      <Text style={styles.text}>Members</Text>
      {family?.kids?.map((kid) => (
        <Text>{kid.name}</Text>
      ))}

      {family?.parents?.map((parent) => (
        <Text>{parent.name} (You)</Text>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  member_box: {
    backgroundColor: Colors.WHITE,
    marginTop: -30,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  text: {
    fontSize: 26,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
});
