import { View, Text } from "react-native";
import React from "react";

import { useRouter } from "expo-router";
import { ProgressBar, MD3Colors } from "react-native-paper";

export default function Progressbar(props) {
  const router = useRouter();
  return (
    <View>
      <ProgressBar progress={props.size} color={MD3Colors.error50} />
    </View>
  );
}
