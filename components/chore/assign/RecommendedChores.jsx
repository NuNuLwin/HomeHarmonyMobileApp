import { useContext, useEffect, useState } from "react";
import { 
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

// firebase
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// context
import { ChoreContext } from "../../../contexts/ChoreContext";
import { useUserProvider } from "../../../contexts/UserContext";

// components
import RecommendedChoreItem from "./RecommendedChoreItem";

// constants
import Colors from "../../../constants/Colors";
import Keys from "../../../constants/Keys";

export default function RecommendedChores({ selectedKid }) {
  const userData = useUserProvider();
  const { setChoreData } = useContext(ChoreContext);
  const [recommendedChore, setRecommendedChore] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [loader, setLoader] = useState(true);

  const GetCurrentUser = async () => {
    try {
      const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
      setCurrentUser(current_user);
  
      const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
      setCurrentRole(current_role);
    } catch (error) {
      console.log('Error getting current user from async storage:', error);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    GetCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedKid) {
      console.log("Fetching chores for selectedKid:", selectedKid);
      GetRecommendedChoresByAge();
    }
  }, [selectedKid]);

  useEffect(() => {
    setChoreData((prevData) => {
      return {
        ...prevData,
        minAge: recommendedChore?.minAge,
        maxAge: recommendedChore?.maxAge,
      };
    });
  }, [recommendedChore]);

  const GetRecommendedChoresByAge = async () => {
    setLoader(true);
    try {
      const age = calculateAge(selectedKid.dob);
      console.log("Selected Kid's Age:", age);

      const q = query(
        collection(db, "RecommendChores"),
        where("minAge", "<=", age),
        where("maxAge", ">=", age)
      );
      const querySnapshot = await getDocs(q);

      const choresList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecommendedChore(choresList); // Initial load from database
      setLoader(false);
    } catch (error) {
      console.error("Error fetching chores: ", error);
    } finally {
      setLoader(false);
    }
  };

  // const GetRecommendedChoresByAge = async () => {
  //   setLoader(true);
  //   try {
  //     const age = calculateAge(selectedKid.dob);
  //     console.log("Selected Kid's Age:", age);

  //     const q = query(
  //       collection(db, "RecommendedChores"),
  //       where("minAge", "<=", age),
  //       where("maxAge", ">=", age)
  //     );

  //     const querySnapshot = await getDocs(q);

  //     if (!querySnapshot.empty) {
  //       const doc = querySnapshot.docs[0];
  //       const choreData = {
  //         id: doc.id,
  //         ...doc.data(),
  //       };
  //       setRecommendedChore(choreData);
  //     } else {
  //       setRecommendedChore(null);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching chores: ", error);
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  const renderSeparator = () => <View style={styles.separator} />;

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    if (
      month < birthDate.getMonth() ||
      (month === birthDate.getMonth() && day < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleAssign = async (docId, chore) => {
    console.log("Assigning chore:", chore);
    console.log("Chore document ID:", docId);
    try {
      await addDoc(collection(db, "AssignChores"), {
        family: userData.email,
        recommendChoreId: chore.id,
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
      GetRecommendedChoresByAge();
    }
  };

  return (
    <View>
      {loader ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={recommendedChore}
          keyExtractor={(item, index) => index.toString()}
          refreshing={loader}
          onRefresh={GetRecommendedChoresByAge}
          ItemSeparatorComponent={renderSeparator}
          renderItem={({ item }) => (
            <RecommendedChoreItem
              chore={item}
              selectedKid={selectedKid}
              onAssign={handleAssign}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.text_wrapper}>
              <Text style={styles.text}>No recommended chores available</Text>
            </View>
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
    marginTop: 20,
    alignSelf: "center",
  },
  text: { fontFamily: "outfit-light", fontSize: 18, color: Colors.GREY },
  text_wrapper: { padding: 30, alignItems: "center" },
});
