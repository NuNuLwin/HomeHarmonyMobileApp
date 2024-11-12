import { View, Text, Image, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import Colors from "../../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function KidInfo({ kid }) {
  const { userData } = useContext(UserContext);

  return (
    <View style={styles.kid_info_box}>
      <View style={styles.img_wrapper}>
        <Image
          source={{ uri: kid.image }}
          style={styles.profile_img}
          onError={(error) =>
            console.log("Image load error:", error.nativeEvent.error)
          }
        />

        <View style={styles.point_box}>
          <Text style={styles.point_text}>{kid.point}</Text>
        </View>

        <Text style={styles.text}>{kid.name}</Text>
      </View>

      <View style={styles.icon_wrapper}>
        {/* <MaterialIcons
          name="pending-actions"
          size={25}
          color={Colors.PRIMARY}
          style={styles.icon}
        /> */}
        <Text style={styles.text2}>5 </Text>
        <Text style={styles.text2}>Pending</Text>
      </View>

      <View style={styles.icon_wrapper}>
        {/* <MaterialIcons
          name="approval"
          size={25}
          color={Colors.PRIMARY}
          style={styles.icon}
        /> */}
        <Text style={styles.text2}>3</Text>
        <Text style={styles.text2}>Approval</Text>
      </View>

      <View style={styles.icon_wrapper}>
        {/* <Ionicons
          name="checkmark-done-circle"
          size={25}
          color={Colors.PRIMARY}
          style={styles.icon}
        /> */}
        <Text style={styles.text2}>10 </Text>
        <Text style={styles.text2}>Completed</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profile_img: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    backgroundColor: Colors.LIGHT_GREY,
  },
  img_wrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  kid_info_box: {
    padding: 10,
    backgroundColor: "#F18181",
    borderRadius: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  point_box: {
    width: 50,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_GREY,
    alignItems: "center",
    marginTop: 5,
  },
  point_text: {
    fontFamily: "outfit-regular",
    fontSize: 14,
  },
  icon: {
    padding: 5,
  },
  icon_wrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  iconContainer: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 10,
    padding: 5,
  },
  text2: {
    fontFamily: "outfit-regular",
    fontSize: 14,
  },
  img1: {
    width: 25,
    height: 25,
  },
});
