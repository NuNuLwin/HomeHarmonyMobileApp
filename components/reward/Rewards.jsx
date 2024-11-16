import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";

// firestore
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

// context
import { useUserProvider } from "../../contexts/UserContext";

// components
import RewardItem from "./RewardItem";

// constants
import Colors from "../../constants/Colors";


const { height } = Dimensions.get("window");

export default function Rewards({ selectedKid, currentUser, currentRole }) {
  const userData = useUserProvider();
  const [rewards, setRewards] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const _query = query(
      collection(db, "Rewards"),
      where("family", "==", userData.email),
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
  }, [selectedKid]);

  /**
   * Used to Get all rewards  from DB
   */
  const GetAllRewards = async () => {
    setRewards([]);
    setLoader(true);
    try {
      const q = query(
        collection(db, "Rewards"),
        where("family", "==", userData.email),
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

  const handleDeleteReward = (rewardToDelete) => {
    console.log("reward..", rewards);
    // console.log("rewardToDelete.name..", rewardToDelete.name);
    const updatedRewards = rewards.filter(
      (reward) => reward.name !== rewardToDelete.name
    );
    console.log("updatedRewards..", updatedRewards);

    setRewards(updatedRewards);
  };
  return (
    <View style={{ height: height - 350 }}>
      <Text style={styles.title}>Rewards for {selectedKid?.name}</Text>

      {selectedKid && rewards.length > 0 ? (
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={rewards.sort((a, b) => a.point - b.point)}
            refreshing={loader}
            onRefresh={() => GetAllRewards()}
            renderItem={({ item, index }) => (
              <RewardItem
                reward={item}
                selectedKid={selectedKid}
                onDelete={handleDeleteReward}
                currentRole={currentRole}
                currentUser={currentUser}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/money.png")}
          />
          <Text style={[styles.text, { marginTop: 15 }]}>No rewards available.</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
  container: {
    // backgroundColor: Colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginTop: "50%",
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
