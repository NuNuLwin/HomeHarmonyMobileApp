import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
  Image,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { TouchableOpacity } from "react-native";
import { auth } from "./../../../config/FirebaseConfig";
import Colors from "./../../../constants/Colors";
import { UserContext } from "../../../contexts/UserContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Profile() {
  const navigation = useNavigation();
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    console.log("From Profile..", userData);
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
      <View style={styles.img_wrapper}>
        <Image
          source={{ uri: userData.selectedProfile.image }}
          style={styles.profile_img}
          onError={(error) =>
            console.log("Image load error:", error.nativeEvent.error)
          }
        />
      </View>

      <Text style={styles.headerText}>{userData.selectedProfile.name}</Text>

      <FontAwesome name="birthday-cake" size={24} color="black" />
      <Text style={styles.text}>{userData.selectedProfile.dob}</Text>

      <TouchableOpacity style={styles.icon_wrapper} onPress={signOutUser}>
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

      {/* Name */}
      {/* <View style={styles.input_wrapper}>
        <Text style={styles.text}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          onChangeText={(val) => setName(val)}
          value={userData.selectedProfile.name}
        />
      </View> */}
      {/* <TouchableOpacity style={styles.btn} onPress={signOutUser}>
        <Text>Logout</Text>
      </TouchableOpacity> */}
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
});
