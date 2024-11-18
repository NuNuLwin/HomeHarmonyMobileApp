import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// router
import { useRouter, useNavigation } from "expo-router";

// context
import { useUserProvider } from "../../contexts/UserContext";

// datetime picker
import DateTimePicker from "@react-native-community/datetimepicker";

// firebase
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

// constants
import Colors from "../../constants/Colors";

export default function addEvent() {
  const navigation = useNavigation();
  const userData = useUserProvider();
  const router = useRouter();

  const [eventName, setEventName] = useState();
  const [eventPlace, setEventPlace] = useState();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChange = (e, _date) => {
    console.log("onChange ===", _date);
    setDate(_date);
  };

  const onTimeChange = (e, selectedTime) => {
    const currentTime = selectedTime || time; // if no time is selected, keep current time
    setTime(currentTime); // update the time state
  };

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const toggleTimePicker = () => setShowTimePicker(!showTimePicker);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerBackTitle: "Calender",
    });
  }, []);

  const handleSave = async () => {
    try {
      // Check if a document with the same event name already exists
      const q = query(
        collection(db, "Events"),
        where("eventName", "==", eventName),
        where("eventPlace", "==", eventPlace),
        where("family", "==", userData.email),
      );

      const querySnapshot = await getDocs(q);

      if (!eventName || !eventPlace) {
        Alert.alert(
          "Validation Error",
          "Event name and place cannot be empty."
        );
      } else if (!querySnapshot.empty) {
        Alert.alert(
          "Duplicate Event",
          "An event with the same name and place already exists."
        );
      } else {
        // Add the new event document
        await addDoc(collection(db, "Events"), {
          eventName: eventName,
          eventPlace: eventPlace,
          date: date.toISOString(),
          time: time.toISOString(),
          family: userData.email,
          createdAt: new Date().toISOString(),
        });

        Alert.alert("Success", "Event saved successfully!", [
          { text: "OK", onPress: () => router.replace({ pathname: "/calendar" }) },
        ]);
      }
    } catch (error) {
      console.error("Error saving event: ", error);
      Alert.alert("Error", "Error saving event. Please try again.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image with Title */}
      <ImageBackground
        style={styles.img}
        source={require("./../../assets/images/event.jpg")}
      >
        <Text style={styles.title}>Add Event</Text>
      </ImageBackground>

      {/* Event Info Section */}
      <View style={styles.info_box}>
        <Text style={styles.info_text}>Event Info</Text>
        <View style={styles.input_wrapper}>
          {/* <Text style={styles.input_text}>Event Name</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Event name"
            onChangeText={(val) => setEventName(val)}
            autoCapitalize="none"
          ></TextInput>
        </View>

        <View style={styles.input_wrapper}>
          {/* <Text style={styles.input_text}>Event Name</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Event place"
            onChangeText={(val) => setEventPlace(val)}
            autoCapitalize="none"
          ></TextInput>
        </View>

        <View style={{ flexDirection: "row", gap: 20 }}>
          <Pressable onPress={toggleDatePicker}>
            <TextInput
              style={styles.input}
              placeholder="Choose Event Date"
              value={date.toDateString()}
              editable={false}
              onPressIn={toggleDatePicker}
            />
          </Pressable>
          <Pressable onPress={toggleTimePicker}>
            <TextInput
              style={styles.input}
              placeholder="Choose Event Time"
              value={time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              editable={false}
              onPressIn={toggleTimePicker}
            />
          </Pressable>
          {/* Date Modal */}
          <Modal
            visible={showDatePicker}
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
                  minimumDate={new Date()}
                />

                {/* Confirm and Cancel Buttons */}
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
                      onPress={() => {
                        toggleDatePicker();
                      }}
                    >
                      <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>

          {/* Time Modal */}
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleTimePicker}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.bottomModal}>
                <DateTimePicker
                  mode="time"
                  display="spinner"
                  value={time}
                  onChange={onTimeChange}
                  style={styles.datePicker}
                />

                {/* Confirm and Cancel Buttons */}
                {Platform.OS === "ios" && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.pickerButton, styles.cancelButton]}
                      onPress={toggleTimePicker} // Close modal without updating time
                    >
                      <Text>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.pickerButton, styles.confirmButton]}
                      onPress={() => {
                        toggleTimePicker(); // Close modal after confirming time
                      }}
                    >
                      <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.btn}>
          <Text style={styles.btn_text}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  img: {
    width: "100%",
    height: height * 0.2, // 40% of screen height
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 24,
    color: Colors.WHITE,
    textAlign: "center",
  },
  info_box: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    marginTop: -20,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info_text: {
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: Colors.BLACK,
  },
  input_wrapper: {
    marginTop: 0,
  },
  input_text: {
    fontFamily: "outfit-regular",
    fontSize: 14,
  },

  input: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    borderRadius: 10,
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
    backgroundColor: Colors.GREEN,
    borderRadius: 20,
  },
  cancelButton: {
    borderColor: Colors.GREEN,
    borderWidth: 1,
    borderRadius: 20,
  },
  confirmText: {
    color: Colors.WHITE,
  },
  btn: {
    backgroundColor: Colors.GREEN,
    padding: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  btn_text: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    color: Colors.WHITE,
  },
});
