import { View, Text, Image, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";

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

export default function KidInfo({ kid, index, currentUser, family }) {
  const [chores, setChores] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // const GetChoresByKid = async () => {
  //   console.log("=== GetChoresByKid ===", kid.name, currentUser);
  //   const _query = query(
  //     collection(db, "AssignChores"),
  //     where("family", "==", currentUser),
  //     where("kidName", "==", kid.name),
  //   );
  //   const querySnapshot = await getDocs(_query);
  //   console.log('querySnapshot ==> ', querySnapshot);
  //   querySnapshot.forEach(x => {
  //     let tmp = {...x.data()};
  //     tmp['id'] = x.id;
  //     console.log('tmp => ', tmp);
  //     setChores((d) => [...d, tmp]);
  //   });
  // }

  // const UpdateChoreCount = (_chores) => {
  //   setPendingCount(_chores.filter(x => x.status === Keys.PENDING).length);
  //   setInProgressCount(_chores.filter(x => x.status === Keys.IN_PROGRESS).length);
  //   setCompletedCount(_chores.filter(x => x.status === Keys.COMPLETED).length);
  // }

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
        if (change.type === "added") {
          let _chore = { id: change.doc.id, ...change.doc.data() };
          if (!chores.find((x) => x.id === _chore.id)) {
            setChores((prev) => [...prev, _chore]);
          }
        } else if (change.type === "modified") {
          let _chore = { id: change.doc.id, ...change.doc.data() };
          let index = chores.findIndex((x) => x.id === _chore.id);
          if (index > -1) {
            let copied = [...chores];
            copied[index] = _chore;
            setChores(copied);
          }
        } else if (change.type === "removed") {
          let _chore = { id: change.doc.id, ...change.doc.data() };
          let index = chores.findIndex((x) => x.id === _chore.id);
          if (index > -1) {
            let copied = chores.filter((x) => x.id !== _chore.id);
            setChores(copied);
          }
        }
      });
    });
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <View
      style={[
        styles.kid_info_box,
        { width: currentUser === kid.name ? "100%" : "auto" },
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
              <Text style={styles.point_text}>{kid.point}</Text>
            </View>

            {/* <Text style={styles.text}>{kid.name}</Text> */}
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
    flexGrow: 1,
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
    justifyContent: "space-around",
  },
  icon_wrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    minWidth: 90,
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
  },
  iconContainer: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 10,
    padding: 5,
  },
  text2: {
    fontFamily: "outfit-regular",
    fontSize: 14,
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
