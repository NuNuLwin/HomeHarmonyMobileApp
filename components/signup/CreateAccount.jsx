import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { SignUpContext } from "../../contexts/SignUpContext.jsx";

export default function CreateAccount() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { signUpData, setSignUpData } = useContext(SignUpContext);

  // Set value from context
  useEffect(() => {
    if (signUpData?.email) {
      setEmail(signUpData.email);
    }
    if (signUpData?.password) {
      setPassword(signUpData.password);
    }
  }, [signUpData]);

  // Update to context
  useEffect(() => {
    setSignUpData((prevData) => ({
      ...prevData,
      email: email,
      password: password,
    }));
  }, [email, password]);

  return (
    <View>
      <Text style={styles.title}>Create new account for your Family</Text>

      {/* Email */}
      <View style={styles.input_wrapper}>
        <Text style={styles.text}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter Email"
          onChangeText={(val) => setEmail(val)}
          autoCapitalize={'none'}
        ></TextInput>
      </View>

      {/* Password */}
      <View style={styles.input_wrapper}>
        <Text style={styles.text}>Password</Text>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Enter Password"
          onChangeText={(val) => setPassword(val)}
        ></TextInput>
      </View>
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

  input: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
  },
});
