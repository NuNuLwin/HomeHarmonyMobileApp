import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

// firebase
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

// icons
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// constants
import Colors from "../../../constants/Colors";
import Keys from "../../../constants/Keys";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function KidInfo({ kid, index, currentUser, family }) {
  const [chores, setChores] = useState([]);
  const [kidPoint, setKidPoint] = useState(null);
  const isFocused = useIsFocused();

  const fetchKidPoint = async () => {
    try {
      const familyQuery = query(
        collection(db, "Families"),
        where("email", "==", family)
      );

      const querySnapshot = await getDocs(familyQuery);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const familyData = doc.data();
          const kidsArray = familyData.kids;

          const findkid = kidsArray.find(
            (findkid) => findkid.name === kid.name
          );

          if (findkid) {
            setKidPoint(findkid.points); // Update the state with the kid's points
          }
        });
      }
    } catch (error) {
      console.error("Error fetching kid info:", error);
    }
  };

  useEffect(() => {
    if (!family || !kid.name) return;

    fetchKidPoint();
  }, []);

  useEffect(() => {
    if (!family || !kid.name) return;

    fetchKidPoint();
  }, [family, kid.name, isFocused]);

  useEffect(() => {
    if (!currentUser) return;

    // GetChoresByKid();
    const _query = query(
      collection(db, "AssignChores"),
      where("family", "==", family),
      where("kidName", "==", kid.name)
    );

    const unsubscribe = onSnapshot(_query, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(
          "=== change ===",
          change.type,
          change.doc.id,
          change.doc.data()
        );
        if (change.type === "added") {
          setChores((prevArray) => [
            ...prevArray,
            { id: change.doc.id, ...change.doc.data() },
          ]);
          fetchKidPoint();
        } else if (change.type === "modified") {
          setChores((prevArray) => {
            const index = prevArray.findIndex(
              (item) => item.id === change.doc.id
            );
            if (index !== -1) {
              const updatedArray = [...prevArray];
              updatedArray[index] = { id: change.doc.id, ...change.doc.data() };
              return updatedArray;
            }
            return prevArray;
          });
          fetchKidPoint();
        } else if (change.type === "removed") {
          setChores((prevArray) =>
            prevArray.filter((item) => item.id !== change.doc.id)
          );
          fetchKidPoint();
        }
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <View
      style={[
        styles.kid_info_box,
        {
          width: currentUser === kid.name ? windowWidth - 20 : windowWidth - 40,
        },
      ]}
    >
      <View style={styles.icon_wrapper_parent2}>
        <View>
          {currentUser === kid.name ? (
            <Text style={styles.title}>Hello, {kid.name}!</Text>
          ) : (
            <Text style={styles.title}>{kid.name}</Text>
          )}
        </View>

        <View style={styles.icon_wrapper_parent}>
          <View style={styles.img_wrapper}>
            <Image
              source={{ uri: kid.image }}
              style={styles.profile_img}
              onError={(error) =>
                console.log("Image load error:", error.nativeEvent.error)
              }
            />

            <View style={styles.point_box}>
              <Text style={styles.point_text}>{kidPoint}</Text>
            </View>
          </View>

          <View style={styles.status_wrapper}>
            <View style={styles.icon_wrapper}>
              <Text style={styles.text2}>
                {chores.filter((x) => x.status === Keys.PENDING).length}
              </Text>
              <Text style={styles.text2}>{Keys.PENDING}</Text>
            </View>

            <View style={styles.icon_wrapper}>
              <Text style={styles.text2}>
                {chores.filter((x) => x.status === Keys.IN_PROGRESS).length}
              </Text>
              <Text style={styles.text2}>{Keys.IN_PROGRESS}</Text>
            </View>

            <View style={styles.icon_wrapper}>
              <Text style={styles.text2}>
                {chores.filter((x) => x.status === Keys.COMPLETED).length}
              </Text>
              <Text style={styles.text2}>{Keys.COMPLETED}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profile_img: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    backgroundColor: Colors.LIGHT_GREY,
  },
  img_wrapper: {
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  kid_info_box: {
    padding: 5,
    backgroundColor: "#F18181",
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  point_box: {
    width: 50,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_GREY,
    alignItems: "center",
    marginTop: 5,
  },
  point_text: {
    fontFamily: "outfit-regular",
    fontSize: 14,
  },
  icon: {
    padding: 5,
  },
  status_wrapper: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    // gap: 10
  },
  icon_wrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.WHITE,
    padding: 5,
    borderRadius: 5,
    width: (windowWidth - 160) / 3,
  },
  icon_wrapper_parent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  icon_wrapper_parent2: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  iconContainer: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 10,
    padding: 5,
  },
  text2: {
    fontFamily: "outfit-regular",
    fontSize: 11,
  },
  img1: {
    width: 25,
    height: 25,
  },
  title: {
    marginBottom: 15,
    fontFamily: "outfit-regular",
    fontSize: 20,
    fontWeight: 700,
  },
});
