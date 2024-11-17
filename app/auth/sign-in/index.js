import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import Colors from "./../../../constants/Colors";
import { TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../../../config/FirebaseConfig";
import HeaderLogo from "./../../../components/common/headerLogo";

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  console.log("auth..", auth);
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleSignIn = () => {
    if (!email && !password) {
      Alert.alert("Please Enter Email & Password");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        router.replace("/family/userlist");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorMessage, errorCode);
        if (errorCode === "auth/invalid-email") {
          Alert.alert("Problem in sign in!", "Invalid email", [{ text: "OK" }]);
        }
        if (errorCode === "auth/missing-password") {
          Alert.alert("Problem in sign in!", "Missing password", [
            { text: "OK" },
          ]);
        }

        if (errorCode === "auth/invalid-credential") {
          Alert.alert("Problem in sign in!", "Invalid Credential", [
            { text: "OK" },
          ]);
        }
      });
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <HeaderLogo />

        <Text style={styles.signin_title}>Sign in</Text>

        {/* Email */}
        <View style={styles.input_wrapper}>
          <Text style={styles.input_text}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            onChangeText={(val) => setEmail(val)}
            autoCapitalize='none'
          ></TextInput>
        </View>

        {/* Password */}
        <View style={styles.input_wrapper}>
          <Text style={styles.input_text}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            placeholder="Enter Password"
            onChangeText={(val) => setPassword(val)}
            autoCapitalize='none'
          ></TextInput>
        </View>

        {/* Sign in button */}
        <TouchableOpacity style={styles.signin_button} onPress={handleSignIn}>
          <Text style={styles.signin_text}>Sign In</Text>
        </TouchableOpacity>

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
    justifyContent: "center",
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
    textAlign: "center",
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
