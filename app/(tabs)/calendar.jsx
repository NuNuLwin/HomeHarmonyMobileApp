import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// firebase
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

// context
import { useUserProvider } from "../../contexts/UserContext";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// router
import { useRouter } from "expo-router";
import { Agenda } from "react-native-calendars";

import Colors from "../../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import Keys from "../../constants/Keys";

// icons
import Ionicons from "@expo/vector-icons/Ionicons";

import moment from "moment";

export default function calendar() {
  const router = useRouter();

  const [items, setItems] = useState({});
  const userData = useUserProvider();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  const GetCurrentUser = async () => {
    try {
      const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
      setCurrentUser(current_user);

      const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
      setCurrentRole(current_role);
    } catch (error) {
      console.error("Error getting async storage update:", error);
    }
  };

  const GetEvents = async () => {
    try {
      setLoading(true);
      let tmpItems = {};
      const _date = Date.now();
      for (let i = -15; i < 15; i++) {
        const time = _date + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        tmpItems[strTime] = [];
      }

      const q = query(
        collection(db, "Events"),
        where("family", "==", userData.email),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.docs.map((doc) => {
        let tmp = {
          id: doc.id,
          ...doc.data(),
        };
        let event_date = moment(tmp.date).format("YYYY-MM-DD");
        if (event_date in tmpItems) {
          tmpItems[event_date].push(tmp);
        } else {
          tmpItems[event_date] = [tmp];
        }

        return tmp;
      });
      setItems(tmpItems);
    } catch (error) {
      console.error("Error fetching chores: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCurrentUser();
  }, []);

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  };

  const handleAddEvent = () => {
    router.push({ pathname: "/calendar/addEvent" });
  };

  const handleDeleteEvent = async (item) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "Events", item.id));
      Alert.alert("Success", "Event deleted successfully!", [
        { text: "OK", onPress: () => GetEvents() },
      ]);
    } catch (error) {
      console.log(`Error deleting the event: ${item.id}`);
      Alert.alert("Error deleting the event!");
    } finally {
      setLoading(false);
    }
  };

  const handleRenderItem = (item, isFirst) => {
    return (
      <TouchableOpacity
        style={[styles.item, { height: item.height }]}
        onPress={async () => {
          await AsyncStorage.setItem(Keys.SELECTED_EVENT, JSON.stringify(item));
          router.push({ pathname: "/calendar/eventDetail" });
        }}
      >
        <View style={styles.itemDetails}>
          <Text style={styles.itemTime}>
            {item.time ? moment(item.time).format("h:mm a").toUpperCase() : ""}
          </Text>
          <Text style={styles.itemTitle}>{item.eventName}</Text>
        </View>
        <View style={styles.itemDetails}>
          <Ionicons name="location-sharp" size={20} color="black" />
          <Text>{item.eventPlace}</Text>
        </View>
        <View style={styles.itemDetails}>
          <Ionicons name="person" size={19} color="black" />
          <Text>{item?.occupancy || 0} guests</Text>
        </View>
        {currentRole === "parent" && (
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => handleDeleteEvent(item)}
          >
            <Image
              style={styles.icon}
              source={require("../../assets/images/delete.png")}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const handleRenderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>No events!</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Agenda
        items={items}
        // Specify how each item should be rendered in agenda
        renderItem={handleRenderItem}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={GetEvents}
        // Initially selected day
        selected={moment(new Date()).format("YYYY-MM-DD")}
        // Specify how empty date content with no items should be rendered
        renderEmptyDate={handleRenderEmptyDate}
        // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
        showClosingKnob={false}
        // Specify your item comparison function for increased performance
        rowHasChanged={(r1, r2) => {
          return r1.id !== r2.id;
        }}
        theme={{
          agendaDayTextColor: "#000000",
          agendaDayNumColor: "#686868",
          // agendaTodayColor: 'red',
          agendaKnobColor: "blue",
        }}
      />
      {currentRole === "parent" && (
        <View style={styles.btnWrapper}>
          <TouchableOpacity style={styles.btn} onPress={handleAddEvent}>
            <Feather name="plus" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
  },
  deleteIcon: {
    position: "absolute",
    top: 45,
    right: 10,
  },
  emptyDate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  icon: {
    width: 20,
    height: 20,
  },
  item: {
    backgroundColor: "#F0FFF0",
    borderRadius: 5,
    flex: 1,
    gap: 10,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    borderColor: "#BDD8BD",
    borderWidth: 1,
  },
  itemDetails: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
  },
  itemTitle: {
    color: "#000000",
    fontWeight: "700",
  },
  itemTime: {
    color: "#484848",
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  btnWrapper: {
    position: "absolute",
    bottom: 20, // Adjust for desired vertical spacing
    right: 20, // Adjust for desired horizontal spacing
  },

  btn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: Colors.GREEN,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
