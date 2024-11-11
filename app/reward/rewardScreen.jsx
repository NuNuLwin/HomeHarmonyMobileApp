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

export default function RewardScreen() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKid, setSelectedKid] = useState();

  useEffect(() => {
    if (userData?.kids) {
      setSelectedKid(userData.kids[0]);
    }
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Rewards",
      headerBackTitle: "Back",
    });
  }, []);

  const handleAddReward = () => {
    setModalVisible(!isModalVisible); // Toggle the modal visibility
  };

  const handleSave = async (rewardName, points) => {
    console.log(rewardName, points);
    setIsLoading(true);

    try {
      await addDoc(collection(db, "Rewards"), {
        family: userData.email,
        name: rewardName,
        point: points,
        status: "Available",
        createdby: userData.currentUser,
      });

      setModalVisible(false);
      Alert.alert("Reward saved successfully!");
    } catch (error) {
      console.error("Error saving reward: ", error);
      Alert.alert("Error saving reward. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const OnSelectedKid = (kid) => {
    setSelectedKid(kid);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <View style={styles.container}>
        <Kids onSelect={OnSelectedKid} selectedKid={selectedKid} />
        <Rewards selectedKid={selectedKid} />
      </View>

      {/* Add Button */}
      <View style={styles.footer}>
        <AddButton handleAddReward={handleAddReward} />
      </View>

      {/* Modal */}
      <AddReward
        isVisible={isModalVisible}
        onClose={handleAddReward}
        onSave={handleSave}
      />
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
