import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomizedChoreItem from "./CustomizedChoreItem";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";
import { UserContext } from "../../../contexts/UserContext";
import Colors from "../../../constants/Colors";
import AddButton from "./AddButton";
import AddCustomChore from "./AddCustomChore";

export default function CustomizedChores({ selectedKid }) {
  const [customChore, setCustomChore] = useState([]);
  const [loader, setLoader] = useState(false);
  const { userData } = useContext(UserContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      const choresList = querySnapshot.docs.map((doc) => doc.data());

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
    console.log(choreName, points);
    setIsLoading(true);

    try {
      await addDoc(collection(db, "CustomChores"), {
        family: userData.email,
        name: choreName,
        point: points,
        createdby: userData.currentUser,
        createdAt: new Date(),
      });

      setModalVisible(false);
      Alert.alert("Custom chore saved successfully!");
    } catch (error) {
      console.error("Error saving custom chore: ", error);
      Alert.alert("Error saving custom chore. Please try again.");
    } finally {
      setIsLoading(false);
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
              <CustomizedChoreItem chore={item} selectedKid={selectedKid} />
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
    flex: 1, // Take up full screen height
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
    // marginBottom: 20,
  },
});
