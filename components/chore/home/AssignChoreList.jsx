import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

// firebase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

// context
import { useUserProvider } from "../../../contexts/UserContext";

// components
import AssignChoreListItem from "./AssignChoreListItem";
import Category from "./Category";

// constants
import Colors from "../../../constants/Colors";
import Keys from "../../../constants/Keys";

export default function AssignChoreList({ currentUser, currentRole }) {
  const userData = useUserProvider();
  const isFocused = useIsFocused();

  const [selectedType, setSelectedType] = useState(Keys.PENDING);
  const [loader, setLoader] = useState(false);
  const [assignedChoreList, setAssignedChoreList] = useState([]);

  useEffect(() => {
    if (userData && currentUser && currentRole) {
      console.log("userData:", userData);
      GetAssignChoreList("Pending");
    }
  }, []);

  useEffect(() => {
    if (userData && currentUser && currentRole) {
      GetAssignChoreList(Keys.PENDING);
    }
  }, [isFocused, userData, currentUser, currentRole]);

  const handleRemoveItem = (chore_id) => {
    if (!chore_id) return;

    setAssignedChoreList(assignedChoreList.filter((x) => x.id !== chore_id));
  };

  const GetAssignChoreList = async (category) => {
    setLoader(true);

    try {
      let q = "";
      if (currentRole === "parent") {
        q = query(
          collection(db, "AssignChores"),
          where("family", "==", userData.email),
          where("status", "==", category)
        );
      } else {
        q = query(
          collection(db, "AssignChores"),
          where("family", "==", userData.email),
          where("status", "==", category),
          where("kidName", "==", currentUser)
        );
      }

      const assignedChores = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((x) => {
        let tmp = { ...x.data() };
        tmp["id"] = x.id;
        assignedChores.push(tmp);
      });

      const others = await Promise.all(
        assignedChores.map((_doc) => {
          if (_doc.recommendChoreId) {
            return getDoc(doc(db, "RecommendChores", _doc.recommendChoreId));
          } else {
            return getDoc(doc(db, "CustomChores", _doc.customChoreId));
          }
        })
      );

      let other_chores = {};
      others.map((other) => (other_chores[other.id] = other.data()));

      assignedChores.forEach((assignedChore) => {
        assignedChore["id"] = assignedChore.id;
        if (assignedChore.recommendChoreId) {
          assignedChore["chore"] = other_chores[assignedChore.recommendChoreId];
        } else {
          assignedChore["chore"] = other_chores[assignedChore.customChoreId];
        }
      });

      setAssignedChoreList(assignedChores);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching chores: ", error);
    }
  };
  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={{ paddingLeft: 10, paddingRight: 10, flex: 1 }}>
      {/* Pass GetAssignChoreList function as the `category` prop */}
      {/* <Category category={GetAssignChoreList} /> */}
      <Category
        category={(value) => {
          setSelectedType(value);
          GetAssignChoreList(value);
        }}
        currentRole={currentRole}
      />
      {loader ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : assignedChoreList.length === 0 ? (
        <View style={styles.container}>
          <Image
            style={styles.img}
            source={require("./../../../assets/images/house.png")}
          />
          {selectedType === Keys.IN_PROGRESS ? (
            <Text style={styles.text}>
              All completed chores that are pending approval shows up in this
              section.
            </Text>
          ) : selectedType === Keys.PENDING ? (
            <Text style={styles.text}>
              All assigned chores shows up in this section.
            </Text>
          ) : (
            <Text style={styles.text}>
              All completed chores shows up in this section.
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={assignedChoreList}
          refreshing={loader}
          onRefresh={() => GetAssignChoreList(selectedType)}
          // ItemSeparatorComponent={renderSeparator}
          renderItem={({ item, index }) => (
            <AssignChoreListItem
              // id={item.id}
              // chore={item.chore}
              assigned_chore={item}
              currentUser={currentUser}
              currentRole={currentRole}
              status={selectedType}
              handleRemoveItem={(chore_id) => handleRemoveItem(chore_id)}
            />
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  loader: {
    marginTop: "50%",
    marginBottom: 20,
    alignSelf: "center",
  },
  img: {
    width: 50,
    height: 50,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginTop: "10%",
    gap: 20,
    // marginBottom: "45%",
  },
  text: {
    alignContent: "center",
    fontSize: 16,
    color: Colors.GREY,
    fontFamily: "outfit-regular",
    justifyContent: "center",
  },
});
