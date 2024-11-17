import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// router
import { useNavigation, useRouter } from "expo-router";

// firebase
import { signOut } from "firebase/auth";
import { auth } from "./../../../config/FirebaseConfig";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// context
import { useUserProvider } from "../../../contexts/UserContext";

// icons
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

// constants
import Colors from "./../../../constants/Colors";
import Keys from "../../../constants/Keys";

export default function Profile() {
  const navigation = useNavigation();
  const router = useRouter();
  const userData = useUserProvider();

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);

  const GetSelectedProfile = async () => {
    try {
      const selected_profile = await AsyncStorage.getItem(
        Keys.SELECTED_PROFILE
      );
      setSelectedProfile(JSON.parse(selected_profile));
    } catch (error) {
      console.error("Error getting async storage update:", error);
    } finally {
      setLoading(false);
    }
  };

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
    GetSelectedProfile();
    GetCurrentUser();

    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Profile",
      headerBackTitle: "Family",
    });
  }, []);

  const signOutUser = () => {
    signOut(auth)
      .then((res) => {
        console.log(res);
        router.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : (
        <>
          <View style={styles.img_wrapper}>
            {selectedProfile && (
              <Image
                source={{ uri: selectedProfile.image }}
                style={styles.profile_img}
                onError={(error) =>
                  console.log("Image load error:", error.nativeEvent.error)
                }
              />
            )}
          </View>

          <Text style={styles.headerText}>{selectedProfile?.name}</Text>

          <FontAwesome name="birthday-cake" size={24} color="black" />
          <Text style={styles.text}>{selectedProfile?.dob}</Text>

          {currentUser &&
            selectedProfile &&
            currentUser === selectedProfile.name && (
              <TouchableOpacity
                style={styles.icon_wrapper}
                onPress={signOutUser}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="exit"
                    size={30}
                    color={Colors.PRIMARY}
                    style={styles.icon}
                  />
                </View>

                <Text style={styles.text2}>Log out</Text>
              </TouchableOpacity>
            )}
        </>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontFamily: "outfit-regular",
    fontSize: 24,
  },
  text: {
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: Colors.GREY,
  },
  text2: {
    fontFamily: "outfit-regular",
    fontSize: 18,
  },
  img_wrapper: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.GREY,
    backgroundColor: Colors.LIGHT_GREY,
    alignSelf: "center",
    marginVertical: 20,
  },
  icon: {
    padding: 10,
  },
  icon_wrapper: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
    backgroundColor: Colors.WHITE,
    padding: 10,
  },
  iconContainer: { backgroundColor: Colors.LIGHT_PRIMARY, borderRadius: 10 },
  input: {
    marginTop: 10,
    padding: 15,
    backgroundColor: Colors.LIGHT_GREY,
    borderRadius: 30,
  },
  profile_img: {
    flex: 1,
    borderRadius: 50,
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
});
