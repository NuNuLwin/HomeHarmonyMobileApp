import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/reward/Header";
import Menu from "../../components/reward/Menu";
import Kids from "../../components/reward/kids";
import { useRouter } from "expo-router";

export default function reward() {
  const router = useRouter();
  const handleRewardMenuClick = () => {
    console.log("handleRewardMenuClick");
    router.push({ pathname: "/reward/rewardList" });
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Header />
        <Menu handleRewardMenuClick={handleRewardMenuClick} />
        <Text>Redeemed History</Text>
        {/* <Kids /> */}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
});
