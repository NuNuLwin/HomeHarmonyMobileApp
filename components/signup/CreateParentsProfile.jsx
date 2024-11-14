import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";

import { SignUpContext } from "../../contexts/SignUpContext.jsx";

// firebase
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/FirebaseConfig.js";

// Image
import * as ImagePicker from "expo-image-picker";

// components
import DateInput from "./DateInput";
import { Uploading } from "../common/Uploading.jsx";

// constants
import Colors from "../../constants/Colors";
import Folders from "@/constants/Folders";

// icons
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";

export default function CreateParentsProfile(props) {
  const [name, setName] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState();
  const [image, setImage] = useState();
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const PROFILE_FOLDER = Folders.PROFILE_FOLDER;

  const { signUpData, setSignUpData } = useContext(SignUpContext);

  console.log(`=== step ${props.step} ===`);

  // Set value from context
  useEffect(() => {
    if (
      props.step.toString() === "2" &&
      signUpData.parents &&
      signUpData.parents[0]
    ) {
      const parentData = signUpData.parents[0];
      console.log("parentData..", parentData);
      setName(parentData.name);
      setDob(parentData.dob);
      setGender(parentData.gender);
      setImage(parentData.image);
    } else if (
      props.step === "3" &&
      signUpData.parents &&
      signUpData.parents[1]
    ) {
      const parentData = signUpData.parents[1];
      setName(parentData.name);
      setDob(parentData.dob);
      setGender(parentData.gender);
      setImage(parentData.image);
    }
  }, []);

  // Update value to context
  useEffect(() => {
    setSignUpData((prevData) => {
      const updatedParents = [...(prevData.parents || [])];
      const currentParent = { name, dob, gender, image };

      if (props.step === "2") {
        updatedParents[0] = currentParent; // First profile
      } else if (props.step === "3") {
        updatedParents[1] = currentParent; // Partner profile
      }

      return {
        ...prevData,
        parents: updatedParents,
      };
    });
  }, [name, dob, gender, image, props.step, setSignUpData]);

  // Events
  const confirmDate = (_date) => {
    console.log("=== confirmDate ===", _date.toDateString());
    setDob(_date.toDateString());
  };

  // Profile Image Upload
  const pickImage = async () => {
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
      setImage(url);
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

    return file_url;
  };

  return (
    <View>
      {props.step === "2" && (
        <Text style={styles.title}>Create your Profile</Text>
      )}
      {props.step === "3" && (
        <Text style={styles.title}>Create your Partner Profile</Text>
      )}

      {/* Image */}
      <View style={image ? styles.img_wrapper : styles.img_wrapper_default}>
        {image ? (
          <Image
            source={{
              uri: image,
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
          onPress={pickImage}
        >
          <Entypo name="edit" size={13} color="black" />
        </TouchableOpacity>
      </View>

      {showModal === true && <Uploading image={image} progress={progress} />}

      {/* Name */}
      <View style={styles.input_wrapper}>
        <Text style={styles.text}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          onChangeText={(val) => setName(val)}
          value={name}
        />
      </View>

      {/* Birthday */}
      <DateInput
        dob={dob}
        confirmDate={confirmDate}
        styles={styles}
        title={true}
      />
      {/* <View style={styles.input_wrapper}>
        <Text style={styles.text}>Date of Birthday</Text>

        <Pressable onPress={toggleDatePicker}>
          <TextInput
            style={styles.input}
            placeholder="Choose DOB"
            value={dob}
            editable={false}
            onPressIn={toggleDatePicker}
          />
        </Pressable>

        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={toggleDatePicker}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomModal}>
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                style={styles.datePicker}
              />

              {Platform.OS === "ios" && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.cancelButton]}
                    onPress={toggleDatePicker}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.pickerButton, styles.confirmButton]}
                    onPress={confirmDate}
                  >
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View> */}

      {/* Gender */}
      <View style={styles.input_wrapper}>
        <Text style={styles.text}>Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Male" && styles.selectedButton,
            ]}
            onPress={() => setGender("Male")}
          >
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Female" && styles.selectedButton,
            ]}
            onPress={() => setGender("Female")}
          >
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>
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
  img_wrapper: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    backgroundColor: Colors.WHITE,
    alignSelf: "center",
  },
  img_wrapper_default: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    backgroundColor: Colors.WHITE,
    padding: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  profile_img: {
    flex: 1,
    borderRadius: 50,
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
    backgroundColor: Colors.LIGHT_GREY,
    borderRadius: 30,
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
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    backgroundColor: Colors.LIGHT_GREY,
    padding: 20,
    borderRadius: 20,
    width: "40%",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: Colors.PRIMARY,
  },
  genderText: {
    fontSize: 18,

    fontFamily: "outfit-regular",
  },
});
