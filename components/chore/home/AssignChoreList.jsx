import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import Category from "./Category";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"; // Add Firebase imports
import { db } from "../../../config/FirebaseConfig";
import { UserContext } from "../../../contexts/UserContext";
import AssignChoreListItem from "./AssignChoreListItem";

export default function AssignChoreList() {
  const [loader, setLoader] = useState(false);
  const { userData } = useContext(UserContext);
  const [assignedChoreList, setAssignedChoreList] = useState([]);

  useEffect(() => {
    setAssignedChoreList([]);
    GetAssignChoreList("Pending");
  }, []);

  const GetAssignChoreList = async (category) => {
    console.log("Selected Category:", category);
    setAssignedChoreList([]);
    setLoader(true);
    try {
      const q = query(
        collection(db, "AssignChores"),
        where("family", "==", userData.email),
        where("status", "==", category)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (_doc) => {
        console.log(_doc.data());

        let assigned_chore = _doc.data();
        if (assigned_chore.recommendChoreId) {
          let _choreRef = doc(
            db,
            "RecommendChores",
            assigned_chore.recommendChoreId
          );
          let _chore = await getDoc(_choreRef);
          if (_chore.exists()) assigned_chore["chore"] = _chore.data();
        } else if (assigned_chore.customChoreId) {
          let _choreRef = doc(db, "CustomChores", assigned_chore.customChoreId);
          let _chore = await getDoc(_choreRef);
          if (_chore.exists()) assigned_chore["chore"] = _chore.data();
        }

        setAssignedChoreList((assignedChoreList) => [
          ...assignedChoreList,
          assigned_chore,
        ]);
      });

      setLoader(false);
    } catch (error) {
      console.error("Error fetching chores: ", error);
      setLoader(false);
    }
  };

  return (
    <View>
      {/* Pass GetAssignChoreList function as the `category` prop */}
      {/* <Category category={GetAssignChoreList} /> */}
      <Category category={(value) => GetAssignChoreList(value)} />
      <FlatList
        data={assignedChoreList}
        renderItem={({ item, index }) => (
          <AssignChoreListItem chore={item.chore} />
        )}
      />
    </View>
  );
}
