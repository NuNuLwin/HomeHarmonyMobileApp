import { useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// firebase
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

// swipeable
import { RectButton, Swipeable } from "react-native-gesture-handler";

// constants
import Colors from "../../../constants/Colors";
import Keys from "../../../constants/Keys";
import { useRouter } from "expo-router";

export default function AssignChoreListItem({
  id,
  chore,
  currentUser,
  currentRole,
  status,
  handleRemoveItem,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChoreUpdate = async (to_delete) => {
    setLoading(true);

    console.log("=== handleChoreUpdate ===", id);

    if (to_delete) {
      try {
        await deleteDoc(doc(db, "AssignChores", id));
        handleRemoveItem(id);
      } catch (error) {
        console.log("Delete assigned chore status error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      let new_status = "";
      if (status === Keys.PENDING && currentRole === "parent") {
        new_status = Keys.COMPLETED;
      } else if (status === Keys.PENDING && currentRole === "kid") {
        new_status = Keys.IN_PROGRESS;
      } else if (status === Keys.IN_PROGRESS && currentRole === "parent") {
        new_status = Keys.COMPLETED;
      }

      console.log("=== new status ===", new_status, id);

      if (!new_status) return;

      try {
        await updateDoc(doc(db, "AssignChores", id), { status: new_status });
        handleRemoveItem(id);
      } catch (error) {
        console.log("Update assigned chore status error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const leftSwipeActions = (e, _chore) => {
    if (
      status === Keys.PENDING ||
      (status === Keys.IN_PROGRESS && currentRole === "parent")
    ) {
      return (
        <View style={{ width: 100, marginTop: 5 }}>
          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
            <RectButton
              onPress={() => handleChoreUpdate(false)}
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

  const rightSwipeActions = (e, _chore) => {
    if (currentRole === "parent") {
      return (
        <View style={{ width: 100, marginTop: 5 }}>
          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
            <RectButton
              onPress={() => handleChoreUpdate(true)}
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
    }
    return null;
  };

  // event
  const handleChoreDetailClick = () => {
    router.push({ pathname: "/chore/choreDetail" });
  };

  return (
    <Swipeable
      renderLeftActions={(e) => leftSwipeActions(e, chore)}
      renderRightActions={(e) => rightSwipeActions(e, chore)}
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
          {chore.image ? (
            <Image source={{ uri: chore.image }} style={styles.img} />
          ) : (
            <Image
              style={styles.img}
              source={require("./../../../assets/images/to-do-list.png")}
            />
          )}
          <View style={styles.infoContainer}>
            <Text style={[styles.text, { fontSize: 16 }]}>{chore.name}</Text>
            <View style={styles.point_container}>
              <View style={styles.left_box}>
                <Text style={[styles.text, { color: Colors.GREY }]}>hi</Text>
              </View>
              <View style={styles.right_box}>
                <Image
                  source={require("./../../../assets/images/coin.png")}
                  style={styles.img1}
                />
                <Text style={[styles.text, { color: Colors.GREY }]}>
                  {chore.point} pts
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
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
