import { 
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

// router
import { useRouter } from "expo-router";

// components
import AssignChoreList from "../../components/chore/home/AssignChoreList";
import Category from "../../components/chore/home/Category";
import Header from "../../components/chore/home/Header";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// constants
import Colors from "./../../constants/Colors";
import Keys from "@/constants/Keys";

import { TouchableOpacity } from "react-native";
// import { signOut } from "firebase/auth";

export default function chore() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const GetCurrentUser = async () => {
    try {
      const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
      setCurrentUser(current_user);
  
      const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
      setCurrentRole  (current_role);
    } catch (error) {
      console.error("Error getting async storage update:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetCurrentUser();
  }, []);
  
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: Colors.WHITE }}>
      {loading ? (
          <View style={styles.container}>
            <ActivityIndicator
              size="small"
              color={Colors.PRIMARY}
              style={styles.loader}
            />
          </View>
        ): (
          <View style={styles.container}>
            <View
              style={{ 
                flexDirection: "row", 
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              {/* <Text style={styles.title}>Hello, {currentUser}!</Text> */}
            </View>
            <ImageBackground
              style={styles.img}
              source={require("./../../assets/images/chore.jpg")}
            >
              <Text style={styles.title}>Chores</Text>
            </ImageBackground>
            <Header 
              currentRole={currentRole}
              currentUser={currentUser}
            />
            <AssignChoreList
              currentRole={currentRole}
              currentUser={currentUser}
            />
            
              <TouchableOpacity onPress={() => {
                router.replace("/family/userlist");
              }}><Text>Select</Text></TouchableOpacity>
          </View>
        )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 5,
    height: '100%',
    // gap: 10,
  },
  img: {
    width: "100%",
    height: 150,
  },
  title: {
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 10,
    fontFamily: "outfit-regular",
    fontSize: 25,
    fontWeight: 700,
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
});
