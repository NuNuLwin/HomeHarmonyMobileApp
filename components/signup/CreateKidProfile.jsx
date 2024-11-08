import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Colors from "../../constants/Colors";
import DateInput from "./DateInput";
import { auth, db } from "./../../config/FirebaseConfig";
import { SignUpContext } from "../../contexts/SignUpContext.jsx";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import LoadingScreen from "./loading.jsx";

export default function CreateKidProfile() {
  const [count, setCount] = useState(1);
  const { signUpData, setSignUpData } = useContext(SignUpContext);
  const [loading, setLoading] = useState(false);
  const [kids, setKids] = useState([{ name: "", dob: "" }]);
  const router = useRouter();

  // Update value to context
  useEffect(() => {
    // Ensure there is at least one kid entry on page load
    if (!signUpData.kids || signUpData.kids.length === 0) {
      setKids([{ name: "", dob: "" }]);
    } else {
      setKids(signUpData.kids);
      setCount(signUpData.kids.length);
    }
  }, []);

  useEffect(() => {
    setSignUpData((prevData) => ({
      ...prevData,
      kids: kids,
    }));
  }, [kids, setSignUpData]);

  const confirmDate = (index, _date) => {
    const updatedKids = [...kids];
    updatedKids[index].dob = _date.toDateString();
    setKids(updatedKids);
  };

  // Add kid profile
  const handleIncreCount = () => {
    setKids([...kids, { name: "", dob: "" }]);
    setCount(signUpData.kids.length + 1);
    setSignUpData((prevData) => ({
      ...prevData,
      kids: kids,
    }));
  };

  // Remove kid profile
  const handleDescCount = () => {
    if (signUpData.kids.length > 1) {
      setKids(kids.slice(0, -1));
      setCount(signUpData.kids.length - 1);
    }
    setSignUpData((prevData) => ({
      ...prevData,
      kids: kids,
    }));
  };

  // Sign up
  const handleSignUp = async () => {
    console.log("========handleSignUp===========");
    let flag = true;
    const kids = signUpData?.kids;

    // Check each kid name and dob is empty
    for (const kid of kids) {
      if (!kid.name || !kid.dob) {
        flag = false;
        break;
      }
    }

    if (!flag) {
      alert("Please fill your children name and date of birth!");
    } else {
      try {
        // Create user with email and password
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          signUpData.email,
          signUpData.password
        );
        const user = userCredential.user;
        console.log(user);

        // Set the document in Firestore
        await setDoc(doc(db, "Families", signUpData.email), {
          email: user.email,
          parents: signUpData.parents,
          kids: signUpData.kids,
        });
        setLoading(false);

        router.replace("/chore");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Alert.alert("Problem in your account set up!", errorMessage, [
        //   { text: "OK" },
        // ]);

        if (errorCode === "auth/email-already-in-use") {
          Alert.alert(
            "Your Family account is already exist",
            "Invalid credentials",
            [{ text: "OK" }]
          );
        }
        console.log(errorMessage, errorCode);
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <Text style={styles.title}>
        How many kids do you have in your family?
      </Text>

      <View style={styles.count_wrapper}>
        <TouchableOpacity onPress={handleDescCount} style={styles.count_icon}>
          <Feather name="minus-circle" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.text}>{count}</Text>
        <TouchableOpacity onPress={handleIncreCount} style={styles.count_icon}>
          <Feather name="plus-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {kids.map((kid, index) => (
        <View key={index} style={styles.box}>
          <View style={styles.img_wrapper}></View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              onChangeText={(val) => {
                const updatedKids = [...kids];
                updatedKids[index].name = val;
                setKids(updatedKids);
              }}
              value={kid.name}
            />

            <DateInput
              dob={kid.dob}
              confirmDate={(_date) => confirmDate(index, _date)}
              styles={styles}
            />
          </View>
        </View>
      ))}

      {/* Sign in button */}
      <TouchableOpacity onPress={handleSignUp} style={styles.signup_button}>
        <Text style={[styles.text, styles.text_style]}>Sign up</Text>
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
  count_wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  count_icon: {
    padding: 20,
  },
  text: {
    fontFamily: "outfit-regular",
    fontSize: 18,
  },
  box: {
    flexDirection: "row",
    backgroundColor: Colors.LIGHT_GREY,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
  },
  img_wrapper: {
    width: 80,
    height: 80,
    padding: 10,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.GREY,
    backgroundColor: Colors.WHITE,
  },
  input: {
    padding: 10,
    marginTop: 5,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    width: "100%",
  },
  signup_button: {
    padding: 10,
    marginTop: 20,
    backgroundColor: "#E26868",
    color: "#fff",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signup_text: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  datePicker: {
    height: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 20,
  },
  cancelButton: {
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 20,
  },
  confirmText: {
    color: Colors.WHITE,
  },
  input_wrapper: {
    marginTop: 5,
  },
});
