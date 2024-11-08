import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import Colors from "../../constants/Colors";
import DateInput from "./DateInput";

import { SignUpContext } from "../../contexts/SignUpContext.jsx";

export default function CreateParentsProfile(props) {
  const [name, setName] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState();
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
    } else if (
      props.step === "3" &&
      signUpData.parents &&
      signUpData.parents[1]
    ) {
      const parentData = signUpData.parents[1];
      setName(parentData.name);
      setDob(parentData.dob);
      setGender(parentData.gender);
    }
  }, []);

  // Update value to context
  useEffect(() => {
    setSignUpData((prevData) => {
      const updatedParents = [...(prevData.parents || [])];
      const currentParent = { name, dob, gender };

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
  }, [name, dob, gender, props.step, setSignUpData]);

  const confirmDate = (_date) => {
    console.log("=== confirmDate ===", _date.toDateString());
    setDob(_date.toDateString());
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
      <View style={styles.img_wrapper}></View>

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
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.GREY,
    backgroundColor: Colors.LIGHT_GREY,
    alignSelf: "center",
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
