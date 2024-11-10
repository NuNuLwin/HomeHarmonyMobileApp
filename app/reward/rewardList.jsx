import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import Modal from "react-native-modal";

// components
import Kids from "../../components/reward/kids";
import AddButton from "../../components/reward/AddButton";
import AddReward from "../../components/reward/AddReward";
import Rewards from "../../components/reward/Rewards";

import { doc, setDoc } from "firebase/firestore";
import { UserContext } from "../../contexts/UserContext";
import { db } from "../../config/FirebaseConfig";

export default function RewardList() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKid, setSelectedKid] = useState();

  useEffect(() => {
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
      await setDoc(doc(db, "Rewards", rewardName), {
        name: rewardName,
        point: points,
        email: userData.email,
        status: "Available",
        createdby: userData.currentUser,
      });

      setModalVisible(false);
      Alert.alert("Reward saved successfully!");
    } catch (error) {
      console.error("Error saving reward: ", error);
      Alert.alert("Error saving reward. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Kids />
        <Rewards />
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
    padding: 20,
    gap: 20,
    justifyContent: "flex-start",
  },

  footer: {
    flex: 1,
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
