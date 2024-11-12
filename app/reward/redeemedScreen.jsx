import { View, SafeAreaView, StyleSheet, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "expo-router";

// components
import Kids from "../../components/reward/kids";
import AddButton from "../../components/reward/AddButton";
import AddReward from "../../components/reward/AddReward";
import Rewards from "../../components/reward/Rewards";

import { addDoc, collection } from "firebase/firestore";
import { UserContext } from "../../contexts/UserContext";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";
import Redeemed from "../../components/reward/Redeemed";

export default function RedeemedScreen() {
  const navigation = useNavigation();
  const { userData, setUserData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKid, setSelectedKid] = useState();

  useEffect(() => {
    if (userData.currentRole === "kid" && userData?.kids) {
      const currentKid = userData.kids.find(
        (kid) => kid.name === userData.currentUser
      );
      setSelectedKid(currentKid);
    } else if (userData.currentRole === "parent" && userData?.kids) {
      setSelectedKid(userData.kids[0]);
    }
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Redeemed",
      headerBackTitle: "Back",
    });
  }, [userData, setSelectedKid]);

  const OnSelectedKid = (kid) => {
    setSelectedKid(kid);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <View style={styles.container}>
        <Kids
          onSelect={OnSelectedKid}
          selectedKid={selectedKid}
          showPoint={true}
        />
        <Redeemed selectedKid={selectedKid} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
  },

  footer: {
    marginBottom: 20, // Adjusted to prevent any layout issues
  },
  modal_wrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modal_container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
  },
});
