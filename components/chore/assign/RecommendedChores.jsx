import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import RecommendedChoreItem from "./RecommendedChoreItem";
import { FlatList } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config/FirebaseConfig";
import { ChoreContext } from "../../../contexts/ChoreContext";

export default function RecommendedChores({ selectedKid }) {
  const { userData } = useContext(UserContext);
  const { choreData, setChoreData } = useContext(ChoreContext);
  const [recommendedChore, setRecommendedChore] = useState(null);
  const [loader, setLoader] = useState(false);

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
    console.log("Updated recommendedChore:", recommendedChore);
  }, [recommendedChore]);

  const GetRecommendedChoresByAge = async () => {
    setLoader(true);
    try {
      const age = calculateAge(selectedKid.dob);
      console.log("Selected Kid's Age:", age);

      const q = query(
        collection(db, "RecommendedChores"),
        where("minAge", "<=", age),
        where("maxAge", ">=", age)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const firstChore = querySnapshot.docs[0].data();
        setRecommendedChore(firstChore);
      } else {
        setRecommendedChore(null);
      }
    } catch (error) {
      console.error("Error fetching chores: ", error);
    } finally {
      setLoader(false);
    }
  };

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

  return (
    <View>
      {loader ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={recommendedChore?.chores || []}
          keyExtractor={(item, index) => index.toString()}
          refreshing={loader}
          onRefresh={GetRecommendedChoresByAge}
          ItemSeparatorComponent={renderSeparator}
          renderItem={({ item }) => (
            <RecommendedChoreItem chore={item} selectedKid={selectedKid} />
          )}
          ListEmptyComponent={() => (
            <Text>No recommended chores available</Text>
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
});
