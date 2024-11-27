import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";

// firestore
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

// context
import { useUserProvider } from "../../../contexts/UserContext";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// components
import AddButton from "./AddButton";
import AddCustomChore from "./AddCustomChore";
import CustomizedChoreItem from "./CustomizedChoreItem";

// constants
import Colors from "../../../constants/Colors";
import Keys from "../../../constants/Keys";
Keys;

export default function CustomizedChores({ selectedKid }) {
  const userData = useUserProvider();

  const [customChore, setCustomChore] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  const GetCurrentUser = async () => {
    try {
      const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
      setCurrentUser(current_user);

      const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
      setCurrentRole(current_role);
    } catch (error) {
      console.log("Error getting current user from async storage:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    GetCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedKid) {
      GetCustomChores();
    }
  }, [selectedKid]);

  const GetCustomChores = async () => {
    setLoader(true);
    try {
      const q = query(
        collection(db, "CustomChores"),
        where("family", "==", userData.email),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const choresList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCustomChore(choresList); // Initial load from database
      setLoader(false);
    } catch (error) {
      console.error("Error fetching chores: ", error);
    } finally {
      setLoader(false);
    }
  };

  const renderSeparator = () => <View style={styles.separator} />;

  const handleModal = () => {
    setModalVisible(!isModalVisible); // Toggle the modal visibility
  };

  const handleSave = async (choreName, points) => {
    setLoader(true);

    try {
      await addDoc(collection(db, "CustomChores"), {
        family: userData.email,
        name: choreName,
        point: points,
        createdby: currentUser,
        createdAt: new Date(),
      });

      setModalVisible(false);
      Alert.alert("Custom chore saved successfully!");
    } catch (error) {
      console.error("Error saving custom chore: ", error);
      Alert.alert("Error saving custom chore. Please try again.");
    } finally {
      setLoader(false);
      GetCustomChores();
    }
  };

  const handleAssign = async (docId, chore) => {
    console.log("Assigning chore:", chore);
    console.log("Chore document ID:", docId);
    try {
      await addDoc(collection(db, "AssignChores"), {
        family: userData.email,
        customChoreId: chore.id,
        kidName: selectedKid.name,
        status: "Pending",
        createdby: currentUser,
        createdAt: new Date(),
      });

      Alert.alert(
        `Assigned ${chore.name} to ${selectedKid.name} successfully!`
      );
    } catch (error) {
      console.error("Error saving assign custom chore: ", error);
      Alert.alert("Error saving assign custom chore. Please try again.");
    } finally {
      GetCustomChores();
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {loader ? (
          <ActivityIndicator
            size="small"
            color={Colors.PRIMARY}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={customChore}
            keyExtractor={(item, index) => index.toString()}
            refreshing={loader}
            onRefresh={GetCustomChores}
            ItemSeparatorComponent={renderSeparator}
            renderItem={({ item }) => (
              <CustomizedChoreItem
                chore={item}
                selectedKid={selectedKid}
                onAssign={handleAssign}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.text_wrapper}>
                <Text style={styles.text}>No own chores/ tasks available</Text>
              </View>
            )}
          />
        )}

        <AddCustomChore
          isVisible={isModalVisible}
          onClose={handleModal}
          onSave={handleSave}
        />
      </View>
      <View style={styles.footer}>
        <AddButton handleModal={handleModal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
  text: { fontFamily: "outfit-light", fontSize: 18, color: Colors.GREY },
  text_wrapper: { padding: 30, alignItems: "center" },
  footer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
