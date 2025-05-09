import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { useUserProvider } from "../../contexts/UserContext";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

import RedeemedItem from "./RedeemedItem";
import { ActivityIndicator } from "react-native";

const { height } = Dimensions.get("window");

export default function Redeemed({ selectedKid, currentUser, currentRole }) {
  const [redeemed, setRedeemed] = useState([]);
  const userData = useUserProvider();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (userData && currentUser && currentRole) {
      GetAllRedeemedByKid();
    }
  }, [selectedKid, userData, currentUser, currentRole]);

  const GetAllRedeemedByKid = async () => {
    setRedeemed([]);
    setLoader(true);
    try {
      const q =
        currentRole === "parent"
          ? selectedKid
            ? query(
                collection(db, "Redeemed"),
                where("family", "==", userData.email),
                where("kidName", "==", selectedKid?.name) // Use optional chaining
              )
            : query(
                collection(db, "Redeemed"),
                where("family", "==", userData.email)
              )
          : currentRole === "kid"
          ? query(
              collection(db, "Redeemed"),
              where("family", "==", userData.email),
              where("kidName", "==", currentUser)
            )
          : null;

      if (q) {
        const querySnapshot = await getDocs(q);

        const redeemedList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            redeemDate: data.redeemDate?.toDate
              ? data.redeemDate.toDate()
              : data.redeemDate,
          };
        });

        // Sort by redeemDate in descending order (latest date first)
        redeemedList.sort((a, b) => b.redeemDate - a.redeemDate);

        setRedeemed(redeemedList);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching redeemed list: ", error);
    }
  };

  return (
    <View style={{ height: height - 350 }}>
      {selectedKid ? (
        <Text style={styles.title}>Redeemed for {selectedKid?.name}</Text>
      ) : (
        <Text style={styles.title}>Redeemed History</Text>
      )}

      {loader ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : redeemed.length > 0 ? (
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={redeemed.sort((a, b) => a.point - b.point)}
            refreshing={loader}
            onRefresh={() => GetAllRedeemedByKid()}
            renderItem={({ item, index }) => (
              <RedeemedItem redeemed={item} selectedKid={selectedKid} />
            )}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            style={styles.img}
            source={require("./../../assets/images/money.png")}
          />
          <Text style={[styles.text, { marginTop: 15 }]}>
            No redemptions made by kids.
          </Text>
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
  loader: {
    marginTop: "50%",
    alignSelf: "center",
  },
});
