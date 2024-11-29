import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";

// router
import { useRouter } from "expo-router";

// context
import { useUserProvider } from "../../contexts/UserContext";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// components
import FamilyMember from "../../components/family/FamilyMember";

// constants
import Colors from "../../constants/Colors";
import Keys from "../../constants/Keys";

export default function family() {
  const router = useRouter();
  const userData = useUserProvider();

  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);

  const GetCurrentUser = async () => {
    try {
      const tmp = await AsyncStorage.getItem(Keys.CURRENT_USER);
      setCurrentUser(tmp);
    } catch (error) {
      console.log("Error getting current user from async storage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCurrentUser();
  }, []);

  const selectProfile = async (profile) => {
    await AsyncStorage.setItem(Keys.SELECTED_PROFILE, JSON.stringify(profile));
    router.push({ pathname: "/family/profile" });
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : (
        <>
          <ImageBackground
            style={styles.img}
            source={require("./../../assets/images/family.jpg")}
          >
            <Text style={styles.title}>{currentUser}'s Family!</Text>
          </ImageBackground>

          <View style={styles.member_box}>
            <View style={styles.body_wrapper}>
              {userData?.parents?.map((parent, index) => (
                <FamilyMember
                  key={index}
                  member={parent}
                  onSelect={selectProfile}
                />
              ))}
            </View>
            <View style={styles.body_wrapper}>
              {userData?.kids?.map((kid, index) => (
                <FamilyMember
                  key={index}
                  member={kid}
                  onSelect={selectProfile}
                />
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 450,
  },
  title: {
    position: "absolute",
    top: 100,
    left: 40,
    fontSize: 20,
    fontFamily: "outfit-bold",
  },
  member_box: {
    flexWrap: "wrap",
    backgroundColor: Colors.WHITE,
    marginTop: -30,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  body_wrapper: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
});
