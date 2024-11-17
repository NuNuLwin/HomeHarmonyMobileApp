import { View, Text, StyleSheet, ScrollView } from "react-native";

// context
import { useUserProvider } from "../../../contexts/UserContext";

// components
import KidInfo from "./KidInfo";
import { StatusBar } from "expo-status-bar";

export default function Header({ currentUser, currentRole }) {
  
  const userData = useUserProvider();

  return (
    <View style={styles.container}>
      {currentRole === "parent" ? (
        <ScrollView horizontal={true}>
          {userData?.kids?.map((kid, index) => ( <KidInfo 
              key={index} 
              kid={kid}
              currentUser={currentUser}
              family={userData.email}
            /> ))}
        </ScrollView>
      ) : (
        <View>
          {userData?.kids?.filter(kid => kid.name === currentUser)
            .map((kid, index) => ( <KidInfo 
              key={index} 
              kid={kid}
              currentUser={currentUser}
              family={userData.email}
            /> ))}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 15,
    padding: 5,
    // marginTop: -60,
    position: "absolute",
    top: StatusBar.length ? StatusBar.length + 60 : "8%",
  },
});
