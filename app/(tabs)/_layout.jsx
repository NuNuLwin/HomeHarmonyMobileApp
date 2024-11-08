import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

export default function Tablayout() {
  return (
    <Tabs>
      <Tabs.Screen name="chore" />
      <Tabs.Screen name="family" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="reward" />
    </Tabs>
  );
}
