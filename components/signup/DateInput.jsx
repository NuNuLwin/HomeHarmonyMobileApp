import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity } from "react-native";

export default function DateInput(props) {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(
    props.dob ? new Date(props.dob) : new Date()
  );

  const onChange = (e, _date) => {
    setDate(_date);
  };

  const toggleDatePicker = () => setShowPicker(!showPicker);

  return (
    <View style={props.styles.input_wrapper}>
      {props.title && <Text style={props.styles.text}>Date of Birthday</Text>}

      <Pressable onPress={toggleDatePicker}>
        <TextInput
          style={props.styles.input}
          placeholder="Choose DOB"
          value={props.dob ? date.toDateString() : ""}
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
        <View style={props.styles.modalOverlay}>
          <View style={props.styles.bottomModal}>
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChange}
              style={props.styles.datePicker}
              maximumDate={new Date()}
            />

            {/* Confirm and Cancel Buttons */}
            {Platform.OS === "ios" && (
              <View style={props.styles.buttonContainer}>
                <TouchableOpacity
                  style={[props.styles.pickerButton, props.styles.cancelButton]}
                  onPress={toggleDatePicker}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    props.styles.pickerButton,
                    props.styles.confirmButton,
                  ]}
                  onPress={() => {
                    props.confirmDate(date);
                    toggleDatePicker();
                  }}
                >
                  <Text style={props.styles.confirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
