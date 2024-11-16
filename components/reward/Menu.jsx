import React, { useContext, useEffect, useState } from "react";
import { 
  ActivityIndicator,
  Image,
  StyleSheet, 
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

// router
import { useRouter } from "expo-router";

// firebase
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

// context
import { useUserProvider } from "../../contexts/UserContext";

// constants
import Colors from "../../constants/Colors";

export default function Menu({
  handleRewardMenuClick,
  handleRedeemedMenuClick,
  currentUser,
  currentRole,
}) {
  const router = useRouter();
  const userData = useUserProvider();
  const [rewardCount, setRewardCount] = useState(0);
  const [redeemedCount, setRedeemedCount] = useState(0);
  const isFocused = useIsFocused();
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [loadingRedeemed, setLoadingRedeemed] = useState(true);

  useEffect(() => {
    if (userData && currentUser && currentRole){
      setLoadingRewards(true);
      setLoadingRedeemed(true);
      CountRewards();
      CountRedeemed();
    }
  }, [isFocused, userData, currentUser, currentRole]);

  const CountRewards = async () => {
    try {
      const q = query(
        collection(db, "Rewards"),
        where("family", "==", userData.email),
        where("status", "==", "Available")
      );
      const querySnapshot = await getDocs(q);
      const rewardCount = querySnapshot.docs.length;
      setRewardCount(rewardCount);
      setLoadingRewards(false);
    } catch (error) {
      console.error("Error fetching rewards: ", error);
      setLoadingRewards(false);
    }
  };

  const CountRedeemed = async () => {
    try {
      const q =
        currentRole === "parent"
          ? query(
              collection(db, "Redeemed"),
              where("family", "==", userData.email)
            )
          : query(
              collection(db, "Redeemed"),
              where("family", "==", userData.email),
              where("kidName", "==", currentUser)
            );
      const querySnapshot = await getDocs(q);
      const redeemedCount = querySnapshot.docs.length;

      setRedeemedCount(redeemedCount);
      setLoadingRedeemed(false);
    } catch (error) {
      console.error("Error fetching redeemed: ", error);
      setLoadingRedeemed(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={handleRewardMenuClick}>
        <Text style={styles.title}>Reward</Text>
        <View style={styles.box1}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/cup.png")}
          />
          <View>
            <Text style={[styles.box_text, styles.number]}>
              {loadingRewards ? (
                <ActivityIndicator size="small" color={Colors.SHADE_BLUE} />
              ) : (
                rewardCount
              )}
            </Text>
            <Text style={styles.box_text}>Rewards</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.box} onPress={handleRedeemedMenuClick}>
        <Text style={styles.title}>Redeem</Text>
        <View style={styles.box1}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/rewards.png")}
          />
          <View>
            <Text style={[styles.box_text, styles.number]}>
              {loadingRedeemed ? (
                <ActivityIndicator size="small" color={Colors.SHADE_BLUE} />
              ) : (
                redeemedCount
              )}
            </Text>
            <Text style={styles.box_text}>Redeemed</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 10 },
  box: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_BLUE,
    padding: 15,
    gap: 10,
  },
  title: {
    color: Colors.SHADE_BLUE,
    fontFamily: "outfit-medium",
    fontSize: 18,
  },
  box1: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  img: {
    width: 50,
    height: 50,
  },
  box_text: {
    color: Colors.SHADE_BLUE,
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  number: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
