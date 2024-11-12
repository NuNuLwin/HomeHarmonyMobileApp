import {
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../../constants/Colors";
import { TouchableOpacity } from "react-native";
import { UserContext } from "../../contexts/UserContext";
import { RectButton, Swipeable } from "react-native-gesture-handler";

import {
  updateDoc,
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../../config/FirebaseConfig";

export default function RewardItem({ reward, selectedKid, onDelete }) {
  const { userData, setUserData } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    setLoading(true);
    try {
      const familiesRef = collection(db, "Families");
      const q = query(
        familiesRef,
        where("email", "==", userData.email.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Family document found
        const familyDoc = querySnapshot.docs[0];
        const familyData = familyDoc.data();

        const kidIndex = familyData.kids.findIndex(
          (kid) => kid.name === selectedKid.name
        );

        if (kidIndex !== -1) {
          const updatedKids = [...familyData.kids];
          updatedKids[kidIndex].point -= reward.point;

          // Update kids points in family document
          await updateDoc(familyDoc.ref, { kids: updatedKids });

          const updatedUserData = {
            ...userData,
            kids: updatedKids,
          };
          setUserData(updatedUserData);
        }

        // Save data to Redeemed collection
        await addDoc(collection(db, "Redeemed"), {
          family: userData.email,
          kidName: selectedKid.name,
          rewardName: reward.name,
          point: reward.point,
          redeemBy: userData.currentUser,
          redeemDate: Timestamp.now(),
        });

        Alert.alert("Congratulations!", `You have redeemed ${reward.name}`);
      } else {
        console.log("No family document found with this email.");
      }
    } catch (error) {
      console.error("Error saving reward: ", error);
      Alert.alert("Error saving redeem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const kidInUserData = userData.kids?.find(
    (kid) => kid.name === selectedKid.name
  );

  const rightSwipeDeleteActions = async (reward) => {
    setLoading(true);
    try {
      const rewardsRef = collection(db, "Rewards");

      const q = query(
        rewardsRef,
        where("name", "==", reward.name),
        where("family", "==", userData.email)
      );

      const querySnapshot = await getDocs(q);

      // Check if reward exists, then delete it
      if (!querySnapshot.empty) {
        const rewardDoc = querySnapshot.docs[0];
        await deleteDoc(rewardDoc.ref);
        onDelete(reward);
        Alert.alert(`Reward ${reward.name} deleted successfully.`);
      } else {
        console.log(`Reward with name "${reward.name}" not found.`);
      }
    } catch (error) {
      console.error("Error deleting reward:", error);
    } finally {
      setLoading(false);
    }
  };
  const rightSwipeActions = (e, re) => {
    if (userData.currentRole === "parent") {
      return (
        <View style={{ width: 100, marginTop: 5 }}>
          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
            <RectButton
              onPress={() => rightSwipeDeleteActions(reward)}
              style={[styles.rightAction, { backgroundColor: "#dd2150" }]}
            >
              {loading ? (
                <Text style={styles.actionText}>Deleting</Text>
              ) : (
                <Text style={styles.actionText}>Delete</Text>
              )}
            </RectButton>
          </Animated.View>
        </View>
      );
    }
    return null;
  };

  return (
    <Swipeable
      // renderLeftActions={LeftSwipeActions}
      renderRightActions={(e) => rightSwipeActions(e, reward)}
      leftThreshold={30}
      rightThreshold={40}
      friction={2}
    >
      <View style={styles.card}>
        <View style={styles.bar}></View>
        <View style={styles.mainContent}>
          <View style={styles.detailsContainer}>
            <Image
              style={styles.img}
              source={require("./../../assets/images/cup.png")}
            />
            <View style={{ gap: 5 }}>
              <Text style={styles.name}>{reward.name}</Text>
              <View style={styles.point_container}>
                <Image
                  style={styles.img1}
                  source={require("./../../assets/images/coin.png")}
                />
                <Text style={styles.point}>{reward.point}</Text>
              </View>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="medium" color={Colors.PINK} />
          ) : kidInUserData && kidInUserData.point >= reward.point ? (
            <TouchableOpacity style={styles.btn} onPress={handleRedeem}>
              <Text style={styles.btn_text}>Redeem</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.insufficient_points_text}>
              Not enough points
            </Text>
          )}
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 5,
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.WHITE,
    // borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_BLUE,
  },
  bar: {
    width: "1%",
    backgroundColor: "#7F9AFD",
    height: "100%",
    // borderTopLeftRadius: 10,
    // borderBottomLeftRadius: 10,
  },

  point_container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  name: { fontFamily: "outfit-regular", fontSize: 18 },
  point: { fontFamily: "outfit-light", fontSize: 14 },
  img: {
    width: 50,
    height: 50,
  },
  img1: {
    width: 25,
    height: 25,
  },
  btn: {
    width: "25%",
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Colors.PINK,
  },
  btn_text: { fontFamily: "outfit-regular", fontSize: 14 },
  mainContent: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 0,
    width: "95%",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
