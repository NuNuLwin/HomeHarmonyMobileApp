import { View, Text, SafeAreaView } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { TouchableOpacity } from "react-native";
import { auth } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function chore() {
  const { userData, setUserData } = useContext(UserContext);
  useEffect(() => {
    console.log("From Chorre..", userData);
  }, []);
  const router = useRouter();

  const signOutUser = () => {
    signOut(auth)
      .then((res) => {
        console.log(res);
        router.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView>
      <Text>chore</Text>
      <TouchableOpacity
        style={{
          padding: 10,
        }}
        onPress={signOutUser}
      >
        <Text style={{ color: "blue" }}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
