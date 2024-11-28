import React, { useEffect, useState, useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

// expo
import { useNavigation } from "expo-router";

// firebase
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// context
import { useUserProvider } from "../../contexts/UserContext";
import { UserContext } from "../../contexts/UserContext";

// components
import AddButton from "../../components/reward/AddButton";
import AddReward from "../../components/reward/AddReward";
import Kids from "../../components/reward/kids";
import Rewards from "../../components/reward/Rewards";

// constants
import Colors from "../../constants/Colors";
import Keys from "../../constants/Keys";

export default function RewardScreen() {
  const navigation = useNavigation();
  const userData = useUserProvider();
  const { setUserData } = useContext(UserContext);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);
  const [selectedKid, setSelectedKid] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  const GetCurrentUser = async () => {
    const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
    setCurrentUser(current_user);

    const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
    setCurrentRole(current_role);

    const familyQuery = query(
      collection(db, "Families"),
      where("email", "==", userData?.email)
    );

    const querySnapshot = await getDocs(familyQuery);

    querySnapshot.forEach((doc) => {
        setUserData(doc.data());
    });

    setIsLoading(false);
  };

  useEffect(() => {
    GetCurrentUser();
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Rewards",
      headerBackTitle: "Back",
    });
  }, []);

  useEffect(() => {
    if (currentUser && currentRole === "kid" && userData?.kids) {
      const currentKid = userData.kids.find((kid) => kid.name === currentUser);
      setSelectedKid(currentKid);
    } else if (currentRole === "parent" && userData?.kids) {
      setSelectedKid(userData.kids[0]);
    }
  }, [userData, currentUser, currentRole]);

  const handleAddReward = () => {
    setModalVisible(!isModalVisible); // Toggle the modal visibility
  };

  const handleSave = async (rewardName, points) => {
    setModalVisible(false);
    setIsListLoading(true);
    rewardName = rewardName.trim();

    try {
      // Check if a document with the same rewardName already exists
      const q = query(
        collection(db, "Rewards"),
        where("family", "==", userData.email),
        where("name", "==", rewardName)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert(
          "Duplicate Reward",
          "A reward with the same name already exists."
        );
      } else {
        await addDoc(collection(db, "Rewards"), {
          family: userData.email,
          name: rewardName,
          point: points,
          status: "Available",
          createdby: currentUser,
        });

        Alert.alert("Success", "Reward saved successfully!");
      }
    } catch (error) {
      console.error("Error saving reward: ", error);
      Alert.alert("Error saving reward. Please try again.");
    } finally {
      setIsListLoading(false);
    }
  };

  const OnSelectedKid = (kid) => {
    setSelectedKid(kid);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : (
        <>
          <View style={styles.container}>
            <Kids
              onSelect={OnSelectedKid}
              selectedKid={selectedKid}
              showPoint={true}
              currentRole={currentRole}
            />
            {isListLoading ? (
              <ActivityIndicator
                size="small"
                color={Colors.PRIMARY}
                style={styles.listLoader}
              />
            ) : (
              <Rewards
                selectedKid={selectedKid}
                currentRole={currentRole}
                currentUser={currentUser}
              />
            )}
          </View>

          {/* Add Button */}
          {currentRole === "parent" && (
            <View style={styles.footer}>
              <AddButton handleAddReward={handleAddReward} />
            </View>
          )}

          {/* Modal */}
          {currentRole === "parent" && (
            <AddReward
              isVisible={isModalVisible}
              onClose={handleAddReward}
              onSave={handleSave}
            />
          )}
        </>
      )}
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
    bottom: "12%",
    right: "50%",
    position: "absolute",
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
  loader: {
    marginTop: "50%",
    marginBottom: 20,
    alignSelf: "center",
  },
  listLoader: {
    marginTop: "50%",
    marginBottom: 20,
    alignSelf: "center",
  },
});
