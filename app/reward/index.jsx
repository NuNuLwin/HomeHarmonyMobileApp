import { View, Text } from "react-native";
import React from "react";

export default function Rewards() {
  console.log("hiiiiiii");
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerBackTitle: "",
    });
  }, []);
  return (
    <View>
      <Text>index</Text>
    </View>
  );
}
