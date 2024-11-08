import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import Colors from "./../../../constants/Colors";
import { TouchableOpacity } from "react-native";

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.logo_wrapper}>
          <Image
            style={styles.logo}
            source={require("./../../../assets/images/HomeHarmonyLogo.png")}
          />
          <Text style={styles.logo_title}>HomeHarmony</Text>
          <Text style={styles.signin_title}>Sign in</Text>
        </View>

        {/* Email */}
        <View style={styles.input_wrapper}>
          <Text style={styles.input_text}>Email</Text>
          <TextInput style={styles.input} placeholder="Enter Email"></TextInput>
        </View>

        {/* Password */}
        <View style={styles.input_wrapper}>
          <Text style={styles.input_text}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            placeholder="Enter Password"
          ></TextInput>
        </View>

        {/* Sign in button */}
        <View style={styles.signin_button}>
          <Text style={styles.signin_text}>Sign In</Text>
        </View>

        <View style={styles.signup_wrapper}>
          <Text>Don’t have account for your family?</Text>
          <TouchableOpacity
            style={styles.signup_button}
            onPress={() => router.replace("auth/sign-up")}
          >
            <Text style={styles.signup_text}>New family</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    padding: 40,
  },
  logo_wrapper: {
    padding: 30,
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logo_title: {
    fontFamily: "akaya-regular",
    fontSize: 30,
    color: Colors.PRIMARY,
  },
  signin_title: {
    fontSize: 30,
    fontFamily: "outfit-regular",
  },
  input_wrapper: {
    marginTop: 10,
  },
  input_text: {
    fontFamily: "outfit-regular",
    fontSize: 20,
  },

  input: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
  },
  signin_button: {
    padding: 10,
    marginTop: 20,
    backgroundColor: "#E26868",
    color: "#fff",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signup_button: {
    padding: 10,
    marginTop: 20,
    borderColor: "#E26868",
    borderWidth: 1,
    color: "#fff",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signin_text: {
    fontFamily: "outfit-regular",
    color: Colors.WHITE,
    fontSize: 20,
  },
  signup_text: {
    fontFamily: "outfit-regular",
    fontSize: 20,
  },

  signup_wrapper: {
    marginTop: 20,
  },
});
