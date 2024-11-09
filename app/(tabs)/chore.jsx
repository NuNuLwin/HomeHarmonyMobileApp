import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { auth } from "../../config/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function chore() {
  const router = useRouter();

  const signOutUser = () => {
    signOut(auth)
        .then((res) => {
            console.log(res);
            router.replace("/");
        })
        .catch((err) => {
            console.log(err);
        })
}

  return (
    <View>
      <Text>chore</Text>
      <TouchableOpacity
        style={{
          padding: 10
        }}
        onPress={signOutUser}
      >
        <Text
          style={{ color: "blue" }}
        >Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
