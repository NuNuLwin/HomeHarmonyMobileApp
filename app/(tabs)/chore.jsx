import { View, Text, SafeAreaView } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function chore() {
  const { userData, setUserData } = useContext(UserContext);
  useEffect(() => {
    console.log("From Chorre..", userData);
  }, []);
  return (
    <SafeAreaView>
      <Text>chore</Text>
    </SafeAreaView>
  );
}
