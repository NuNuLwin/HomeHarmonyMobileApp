import { useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// router
import { useRouter } from "expo-router";

// firebase
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

// swipeable
import { RectButton, Swipeable } from "react-native-gesture-handler";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// constants
import Colors from "../../../constants/Colors";
import Keys from "../../../constants/Keys";

export default function AssignChoreListItem({
  assigned_chore,
  currentUser,
  currentRole,
  status,
  handleRemoveItem,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateKidPoints = async () => {
    const familyDocRef = doc(db, "Families", assigned_chore.family);
        const familyDoc = await getDoc(familyDocRef);

        if (familyDoc.exists()) {
          const familyData = familyDoc.data();
          const kidsArray = familyData.kids;
          const kidName = assigned_chore.kidName;

          const kidIndex = kidsArray.findIndex((kid) => kid.name === kidName);

          if (kidIndex !== -1) {
            console.log("Kid found in the family. Updating points...");

            const kidData = kidsArray[kidIndex];
            const currentPoints = kidData.points || 0;
            const newPoints = currentPoints + assigned_chore.chore.point;

            // Update the kid's points in the family's document
            kidsArray[kidIndex].points = newPoints;

            await updateDoc(familyDocRef, {
              kids: kidsArray,
            });

            Alert.alert(
              "Completed",
              "Assigned chore has been marked as completed!",
              [
                {
                  text: "OK",
                  onPress: () => {},
                },
              ]
            );
          } else {
            console.log("Kid not found in the kids array.");
          }
        } else {
          console.log("Family document not found.");
        }
  }

  const handleChoreUpdate = async (to_delete, to_reject) => {
    setLoading(true);

    console.log("=== handleChoreUpdate ===", assigned_chore.id);

    let shouldUpdateKidPoints = false;

    if (to_delete) {
      try {
        await deleteDoc(doc(db, "AssignChores", assigned_chore.id));
        handleRemoveItem(assigned_chore.id);
      } catch (error) {
        console.log("Delete assigned chore status error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      let new_status = "";
      if (to_reject) {
        new_status = Keys.PENDING;
      }
      else if (status === Keys.PENDING && currentRole === "parent") {
        new_status = Keys.COMPLETED;
        shouldUpdateKidPoints = true;
      } else if (status === Keys.PENDING && currentRole === "kid") {
        new_status = Keys.IN_PROGRESS;
      } else if (status === Keys.IN_PROGRESS && currentRole === "parent") {
        new_status = Keys.COMPLETED;
        shouldUpdateKidPoints = true;
      }

      console.log("=== new status ===", new_status, assigned_chore.id);

      if (!new_status) return;

      try {
        if (shouldUpdateKidPoints) {
          await updateKidPoints();
        }
        await updateDoc(doc(db, "AssignChores", assigned_chore.id), { status: new_status });
        handleRemoveItem(assigned_chore.id);
      } catch (error) {
        console.log("Update assigned chore status error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const leftSwipeActions = () => {
    if (
      status === Keys.PENDING ||
      (status === Keys.IN_PROGRESS && currentRole === "parent")
    ) {
      return (
        <View style={{ width: 100, marginTop: 5 }}>
          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
            <RectButton
              onPress={() => handleChoreUpdate(false, false)}
              style={[styles.rightAction, { backgroundColor: Colors.GREEN }]}
            >
              {loading ? (
                <Text style={styles.actionText}>Updating</Text>
              ) : (
                <Text style={styles.actionText}>Complete</Text>
              )}
            </RectButton>
          </Animated.View>
        </View>
      );
    }
    return null;
  };

  const rightSwipeActions = () => {
    if (currentRole === "parent" && status === Keys.COMPLETED) {
      return (
        <View style={{ width: 100, marginTop: 5 }}>
          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
            <RectButton
              onPress={() => handleChoreUpdate(true, false)}
              style={[styles.rightAction, { backgroundColor: Colors.RED }]}
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
    } else if (currentRole === "parent" && status === Keys.IN_PROGRESS) {
      return (
        <View style={{ width: 100, marginTop: 5 }}>
          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
            <RectButton
              onPress={() => handleChoreUpdate(false, true)}
              style={[styles.rightAction, { backgroundColor: Colors.RED }]}
            >
              {loading ? (
                <Text style={styles.actionText}>Rejecting</Text>
              ) : (
                <Text style={styles.actionText}>Reject</Text>
              )}
            </RectButton>
          </Animated.View>
        </View>
      );
    }
    return null;
  };

  // event
  const handleChoreDetailClick = async () => {
    await AsyncStorage.setItem(Keys.SELECTED_CHORE, JSON.stringify(assigned_chore));
    router.push({ pathname: "/chore/choreDetail" });
  };

  return (
    <Swipeable
      renderLeftActions={() => leftSwipeActions()}
      renderRightActions={() => rightSwipeActions()}
      leftThreshold={30}
      rightThreshold={40}
      friction={2}
    >
      <TouchableOpacity
        onPress={handleChoreDetailClick}
        style={[
          styles.card,
          {
            backgroundColor:
              Colors.CHORE_COLORS[status.toUpperCase().replace("-", "_")],
          },
        ]}
      >
        <View style={styles.bar}></View>
        <View style={styles.mainContent}>
          {assigned_chore.chore.image ? (
            <Image source={{ uri: assigned_chore.chore.image }} style={styles.img} />
          ) : (
            <Image
              style={styles.img}
              source={require("./../../../assets/images/to-do-list.png")}
            />
          )}
          <View style={styles.infoContainer}>
            <Text style={[styles.text, { fontSize: 16 }]}>{assigned_chore.chore.name}</Text>
            <View style={styles.point_container}>
              <View style={styles.left_box}>
                <Text style={[styles.text, { color: Colors.GREY }]}>{assigned_chore.kidName}</Text>
              </View>
              <View style={styles.right_box}>
                <Image
                  source={require("./../../../assets/images/coin.png")}
                  style={styles.img1}
                />
                <Text style={[styles.text, { color: Colors.GREY }]}>
                  {assigned_chore.chore.point} pts
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: Colors.LIGHT_BLUE,
    borderRadius: 10,
  },
  img: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  img1: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  infoContainer: {
    flex: 1,
  },
  point_container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 5,
  },

  btnContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  btn: {
    backgroundColor: Colors.PINK,
    borderColor: Colors.PINK,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: "outfit-regular",
    fontSize: 14,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  bar: {
    width: 1,
    height: "100%",
  },
  mainContent: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  left_box: {
    flex: 2,
    alignItems: "flex-start",
  },
  right_box: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
});
