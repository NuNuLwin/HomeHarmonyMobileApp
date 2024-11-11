import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../constants/Colors";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function AddReward({ isVisible, onClose, onSave }) {
  const [rewardName, setRewardName] = useState("");
  const [points, setPoints] = useState(0);

  const handleSave = () => {
    if (!rewardName || !points) {
      Alert.alert("Please fill in all fields.");
      return;
    }
    onSave(rewardName, points);
    setRewardName("");
    setPoints(0);
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modal_wrapper}>
        <View style={styles.modal_container}>
          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close-outline" size={24} color="grey" />
          </TouchableOpacity>

          <Text style={styles.title}>Add Reward</Text>
          <View style={styles.input_wrapper}>
            <Image
              style={styles.img}
              source={require("./../../assets/images/cup.png")}
            />
            <TextInput
              style={styles.input}
              placeholder="Reward Name"
              value={rewardName}
              onChangeText={(val) => setRewardName(val)}
            ></TextInput>
          </View>

          <View style={styles.input_wrapper}>
            <Image
              style={styles.img}
              source={require("./../../assets/images/coin.png")}
            />
            <TextInput
              style={styles.input}
              placeholder="Point"
              keyboardType="numeric"
              value={points}
              onChangeText={(val) => setPoints(parseInt(val))}
            ></TextInput>
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.btn}>
            <Text style={styles.btn_text}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal_wrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modal_container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  input_wrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  img: {
    width: 45,
    height: 45,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#AFACAC",
    padding: 20,
    margin: 10,
    width: "80%",
  },
  btn: {
    backgroundColor: Colors.PINK,
    padding: 10,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  btn_text: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    // color: Colors.WHITE,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
});
