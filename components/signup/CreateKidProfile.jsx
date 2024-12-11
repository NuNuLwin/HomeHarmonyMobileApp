import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, Image } from "react-native";
import { TouchableOpacity } from "react-native";

// expo
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

// constants
import Colors from "../../constants/Colors";
import Folders from "@/constants/Folders";

// components
import DateInput from "./DateInput";
import LoadingScreen from "./loading.jsx";
import { Uploading } from "../common/Uploading.jsx";

// firebase
import { auth, db, storage } from "./../../config/FirebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Image
import * as ImagePicker from "expo-image-picker";

// context
import { SignUpContext } from "../../contexts/SignUpContext.jsx";

// icons
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

// helper
import { stringToHex } from "../../config/helper.js";

export default function CreateKidProfile({ onSignUp }) {
  const [count, setCount] = useState(1);
  const { signUpData, setSignUpData } = useContext(SignUpContext);
  const [loading, setLoading] = useState(false);
  const [kids, setKids] = useState([{ name: "", dob: "", points: 0 }]);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState();
  const PROFILE_FOLDER = Folders.PROFILE_FOLDER;

  // Update value to context
  useEffect(() => {
    // Ensure there is at least one kid entry on page load
    if (!signUpData.kids || signUpData.kids.length === 0) {
      setKids([{ name: "", dob: "", points: 0 }]);
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

  // Events
  // Profile Image Upload
  const pickImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.2,
    });

    if (!result.canceled) {
      console.log("img:", result.assets[0].uri);
      setImage(result.assets[0].uri);
      setShowModal(true);
      const url = await uploadImage(result.assets[0].uri, "image");
      const updatedKids = [...kids];
      updatedKids[index].image = url;
      setKids(updatedKids);
      setShowModal(false);
    }
  };

  async function doUploadImage(uri, uploadProgress) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(
      storage,
      `${PROFILE_FOLDER}/` + new Date().getTime()
    );
    const task = uploadBytesResumable(storageRef, blob);

    task.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (uploadProgress) {
          setProgress(parseInt(progress.toFixed()));
        }
      },
      (error) => {
        // handle error
        console.log("File upload error:", error);
      }
    );
    await task;
    return await getDownloadURL(task.snapshot.ref);
  }

  const uploadImage = async (uri) => {
    let file_url = await doUploadImage(uri, true);

    // clean up
    setProgress(0);
    setImage(null);

    return file_url;
  };

  const confirmDate = (index, _date) => {
    const updatedKids = [...kids];
    updatedKids[index].dob = _date.toDateString();
    setKids(updatedKids);
  };

  // Add kid profile
  const handleIncreCount = () => {
    setKids([...kids, { name: "", dob: "", points: 0 }]);
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
    console.log(signUpData);

    let flag = true;
    const kids = signUpData?.kids;

    // Check each kid name and dob is empty
    for (const kid of kids) {
      if (!kid.name || !kid.dob || !kid.image) {
        flag = false;
        break;
      }
    }

    if (!flag) {
      alert("Please fill your children name and date of birth!");
    } else {
      try {
        // Create user with email and password
        onSignUp();
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
          passcode: stringToHex(signUpData.passcode),
          parents: signUpData.parents,
          kids: signUpData.kids,
        });
        setLoading(false);

        router.replace("/family/userlist");
      } catch (error) {
        setLoading(false);
        onSignUp();
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/email-already-in-use") {
          Alert.alert(
            "Your Family account is already exist",
            "Invalid credentials",
            [{ text: "OK" }]
          );
        }
        if (errorCode === "auth/weak-password") {
          Alert.alert(
            "Password should be at least 6 characters",
            "Invalid credentials",
            [{ text: "OK" }]
          );
        }
        // Alert.alert("Problem in your account set up!", errorMessage, [
        //   { text: "OK" },
        // ]);
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

      {showModal === true && <Uploading image={image} progress={progress} />}

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
          <View
            style={kid.image ? styles.img_wrapper : styles.img_wrapper_default}
          >
            {kid.image ? (
              <Image
                source={{
                  uri: kid.image,
                }}
                style={styles.profile_img}
              />
            ) : (
              <FontAwesome5 name="user" size={40} color="grey" />
            )}
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 25,
                height: 25,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: Colors.GREY,
                backgroundColor: Colors.LIGHT_GREY,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => pickImage(index)}
            >
              <Entypo name="edit" size={13} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              onChangeText={(val) => {
                const updatedKids = [...kids];
                updatedKids[index].name = val.trim();
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
  profile_img: {
    flex: 1,
    borderRadius: 50,
  },
  img_wrapper: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.GREY,
    backgroundColor: Colors.WHITE,
  },
  img_wrapper_default: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    backgroundColor: Colors.WHITE,
    padding: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
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
  text_style: {
    color: Colors.WHITE,
  },
});
