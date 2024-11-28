import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";

// components
import { SignUpContext } from "../../contexts/SignUpContext.jsx";

// icons
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

export default function CreateAccount() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [passcode, setPasscode] = useState();
  const [showPasscode, setShowPasscode] = useState(false);

  const { signUpData, setSignUpData } = useContext(SignUpContext);

  // Set value from context
  useEffect(() => {
    if (signUpData?.email) {
      setEmail(signUpData.email);
    }
    if (signUpData?.password) {
      setPassword(signUpData.password);
    }
    if (signUpData?.passcode) {
      setPasscode(signUpData.passcode);
    }
  }, [signUpData]);

  // Update to context
  useEffect(() => {
    setSignUpData((prevData) => ({
      ...prevData,
      email: email,
      password: password,
      passcode: passcode,
    }));
  }, [email, password, passcode]);

  return (
    <View>
      <TouchableOpacity
        // style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => {
          // setHideStuff(false);
          Keyboard.dismiss();
        }}
      >
        <Text style={styles.title}>Create new account for your Family</Text>

        {/* Email */}
        <View style={styles.input_wrapper}>
          <Text style={styles.text}>Email</Text>
          <View style={styles.textbox_wrapper}>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Enter Email"
              onChangeText={(val) => setEmail(val)}
              autoCapitalize={"none"}
            ></TextInput>
          </View>
        </View>

        {/* Password */}
        <View style={styles.input_wrapper}>
          <Text style={styles.text}>Password</Text>

          <View style={styles.textbox_wrapper}>
            <TextInput
              secureTextEntry={!showPassword}
              value={password}
              style={styles.input}
              placeholder="Enter Password"
              onChangeText={(val) => setPassword(val)}
              textContentType="oneTimeCode"
            ></TextInput>
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={"#aaa"}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
          <Text style={[styles.text, { color: Colors.GREY, fontSize: 12 }]}>
            This is a family password, shareable with everyone.
          </Text>
        </View>

        {/* Passcode */}
        <View style={styles.input_wrapper}>
          <Text style={styles.text}>Passcode - 4 Digits</Text>

          <View style={styles.textbox_wrapper}>
            <TextInput
              secureTextEntry={!showPasscode}
              value={passcode}
              style={styles.input}
              placeholder="Enter Passcode"
              onChangeText={(val) => setPasscode(val.replace(/[^0-9]/g, ""))}
              textContentType="oneTimeCode"
              maxLength={4}
              keyboardType="numeric"
            ></TextInput>
            <MaterialCommunityIcons
              name={showPasscode ? "eye-off" : "eye"}
              size={24}
              color={"#aaa"}
              onPress={() => setShowPasscode(!showPasscode)}
            />
          </View>
          <Text style={[styles.text, { color: Colors.GREY, fontSize: 12 }]}>
            Set a passcode for the security of your and your partner's profiles.
            Keep it private and do not share with children.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 24,
    textAlign: "center",
    fontFamily: "outfit-bold",
  },
  input_wrapper: {
    marginTop: 20,
  },
  text: {
    fontFamily: "outfit-regular",
    fontSize: 18,
  },
  textbox_wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    flex: 1,
    paddingVertical: 20,
    paddingRight: 10,
  },
});
