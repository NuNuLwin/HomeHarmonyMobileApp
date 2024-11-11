import { View, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/reward/Header";
import Menu from "../../components/reward/Menu";
import { useRouter } from "expo-router";
import Redeemed from "../../components/reward/Redeemed";

export default function reward() {
  const router = useRouter();
  const handleRewardMenuClick = () => {
    router.push({ pathname: "/reward/rewardScreen" });
  };
  const handleRedeemedMenuClick = () => {
    router.push({ pathname: "/reward/redeemedScreen" });
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Header />
        <Menu
          handleRewardMenuClick={handleRewardMenuClick}
          handleRedeemedMenuClick={handleRedeemedMenuClick}
        />

        <Redeemed />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
});
