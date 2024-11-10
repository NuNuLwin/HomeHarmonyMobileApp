import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { UserContext } from "../../contexts/UserContext";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

import RewardItem from "./RewardItem";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const { userData, setUserData } = useContext(UserContext);
  const [loader, setLoader] = useState(false);

  // useEffect(() => {
  //   setRewards([]);
  //   GetAllRewards();
  //   console.log("rewards..", rewards);
  // }, []);

  useEffect(() => {
    setRewards([]);

    const _query = query(
      collection(db, "Rewards"),
      where("email", "==", userData.email),
      where("status", "==", "Available")
    );

    const unsubscribe = onSnapshot(_query, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let _reward = { id: change.doc.id, ...change.doc.data() };
          if (!rewards.find((x) => x.id === _reward.id)) {
            setRewards((prevRewards) => [...prevRewards, _reward]);
          }
        }
      });
    });
    return () => unsubscribe();
  }, []);

  /**
   * Used to Get all rewards  from DB
   */
  const GetAllRewards = async () => {
    setRewards([]);
    setLoader(true);
    try {
      const q = query(
        collection(db, "Rewards"),
        where("email", "==", userData.email),
        where("status", "==", "Available")
      );
      const querySnapshot = await getDocs(q);

      const rewardsList = querySnapshot.docs.map((doc) => doc.data());
      setRewards(rewardsList);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching rewards: ", error);
    }
  };
  return (
    <View>
      <Text style={styles.title}>All Rewards</Text>

      {rewards.length > 0 ? (
        <View style={{ height: "80%" }}>
          <FlatList
            data={rewards.sort((a, b) => a.point - b.point)}
            refreshing={loader}
            onRefresh={() => GetAllRewards()}
            renderItem={({ item, index }) => <RewardItem reward={item} />}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/money.png")}
          />
          <Text style={styles.text}>No rewards available.</Text>
        </View>
      )}

      {/* {rewards && rewards.length > 0 ? (
        rewards.map((reward, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.bar}></View>
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                gap: 10,
                paddingLeft: 0,
              }}
            >
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
          </View>
        ))
      ) : (
        <View style={styles.container}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/money.png")}
          />
          <Text style={styles.text}>No rewards available.</Text>
        </View>
      )} */}
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  container: {
    // backgroundColor: Colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },

  text: {
    fontFamily: "outfit-regular",
    fontSize: 20,
    color: Colors.GREY,
  },
  img: {
    width: 50,
    height: 50,
  },
});
