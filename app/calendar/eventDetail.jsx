import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// router
import { useNavigation } from "expo-router";

// firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// contacts
import * as Contacts from "expo-contacts";

// sms
import * as SMS from "expo-sms";

// constants
import Colors from "../../constants/Colors";
import Keys from "../../constants/Keys";

import moment from "moment";

export default function eventDetail() {
  const navigation = useNavigation();

  const [currentRole, setCurrentRole] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [guestList, setGuestList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [showGuestList, setShowGuestList] = useState(false);
  const [message, setMessage] = useState("");
  const [hideStuff, setHideStuff] = useState(false);

  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);

  const messageRef = useRef(null);

  const getSelectedEvent = async () => {
    try {
      let selected_event = await AsyncStorage.getItem(Keys.SELECTED_EVENT);
      selected_event = JSON.parse(selected_event);

      const docRef = doc(db, "Events", selected_event.id);
      const docSnap = await getDoc(docRef);
      selected_event = {
        id: selected_event.id,
        ...docSnap.data(),
      };
      if (selected_event?.message) {
        setMessage(selected_event.message);
      } else {
        setMessage(
          "Dear Friends,\n" +
            "We are excited to invite you to celebrate " +
            `${selected_event.eventName} with us on ${moment(
              selected_event.date
            ).format("MMMM DD, YYYY")}, ` +
            `at ${moment(selected_event.time)
              .format("h:mm a")
              .toUpperCase()}. ` +
            `The celebration will take place at ${selected_event.eventPlace}.\n` +
            "We hope to see you there!"
        );
      }
      setGuestList(selected_event.guests);
      setSelectedEvent(selected_event);
      if (selected_event.guests) {
      }

      const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
      setCurrentRole(current_role);
    } catch (error) {
      console.error("Error getting async storage update:", error);
    } finally {
      setLoading(false);
    }
  };

  const getContactList = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    setModalLoading(true);

    const { data } = await Contacts.getContactsAsync({});
    let _contactList = [];

    data.forEach((x) => {
      let firstName = x.firstName || "";
      let lastName = x.lastName || "";
      let middleName = x.middleName || "";
      let phones = [];

      x.phoneNumbers?.forEach((y) => phones.push(y.number));

      if (phones) {
        let item = {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          phones,
        };
        if (!checkIfInvitationExists(item)) {
          _contactList.push(item);
        }
      }
    });
    _contactList.sort((a, b) => a.first_name.localeCompare(b.first_name));
    setContactList(_contactList);
    setTimeout(() => setModalLoading(false), 1000);
  };

  const handleInviteClicked = async (item) => {
    setGuestLoading(true);

    try {
      let copied = [];
      if (guestList) {
        copied = [...guestList];
      }

      copied.push(item);
      await updateDoc(doc(db, "Events", selectedEvent.id), { guests: copied });
      setGuestList(copied);
    } catch (error) {
      console.log("Adding guest error:", error);
      Alert.alert("Error adding the guest!");
    } finally {
      setGuestLoading(false);
    }
  };

  const handleDeleteGuest = async (item) => {
    setGuestLoading(true);

    try {
      let copied = guestList.filter(
        (x) =>
          x.first_name === item.first_name &&
          x.middle_name === item.middle_name &&
          x.last_name === item.last_name
      );
      await updateDoc(doc(db, "Events", selectedEvent.id), { guests: copied });
      setGuestList(copied);
    } catch (error) {
      console.log("Deleting guest error:", error);
      Alert.alert("Error deleting the guest!");
    } finally {
      setGuestLoading(false);
    }
  };

  const updateMessage = async () => {
    try {
      await updateDoc(doc(db, "Events", selectedEvent.id), {
        message: message,
      });
    } catch (error) {
      console.log("Deleting guest error:", error);
    }
  };

  const handleSendMessage = async () => {
    if (smsLoading) return;

    setSmsLoading(true);

    const contactPhones = [];
    guestList.forEach((x) => {
      if (x.phones) {
        contactPhones.push(...x.phones);
      }
    });

    // console.log('=== message ===', message);
    // console.log('=== contactPhones ===', contactPhones);

    const result = await SMS.isAvailableAsync();
    if (result) {
      const { result: sendResult } = await SMS.sendSMSAsync(
        contactPhones,
        message
      );

      if (sendResult === "sent") {
        Alert.alert("Sucess", "Message sent successfully!", [
          {
            text: "OK",
            onPress: async () => {
              await updateMessage();
              setSmsLoading(false);
            },
          },
        ]);
      } else {
        Alert.alert("Error", "Message failed to send!", [
          { text: "OK", onPress: () => setSmsLoading(false) },
        ]);
      }
    } else {
      Alert.alert("Fail", "Service not available!", [
        { text: "OK", onPress: () => setSmsLoading(false) },
      ]);
    }
  };

  const checkIfInvitationExists = (item) => {
    if (!guestList) return false;

    return guestList.some(
      (guest) =>
        guest.first_name === item.first_name &&
        guest.middle_name === item.middle_name &&
        guest.last_name === item.last_name
    );
  };

  /* Components */
  const GuestItem = ({ item }) => {
    return (
      <View style={styles.contact_wrapper}>
        <View style={styles.contact_info}>
          <Text
            style={styles.contact_info_name}
          >{`${item.first_name} ${item.last_name}`}</Text>
          <Text style={styles.contact_info_phone}>
            {item.phones ? item.phones.join(", ") : ""}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteIcon} onPress={handleDeleteGuest}>
          <Image
            style={styles.icon}
            source={require("../../assets/images/delete.png")}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const ContactItem = ({ item }) => {
    return (
      <View style={styles.contact_wrapper}>
        <View style={styles.contact_info}>
          <Text
            style={styles.contact_info_name}
          >{`${item.first_name} ${item.middle_name} ${item.last_name}`}</Text>
          <Text style={styles.contact_info_phone}>
            {item.phones ? item.phones.join(", ") : ""}
          </Text>
        </View>
        {checkIfInvitationExists(item) ? (
          <></>
        ) : (
          <TouchableOpacity onPress={() => handleInviteClicked(item)}>
            <Text style={styles.invitation_text}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Detail",
      headerBackTitle: "Calendar",
    });

    getSelectedEvent();
  }, []);

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{ flex: 1, backgroundColor: "red" }}
    //   keyboardVerticalOffset={Platform.select({
    //     ios: () => 60,
    //     android: () => 60
    //  })()}
    // >
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => {
          setHideStuff(false);
          Keyboard.dismiss();
        }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={Colors.PRIMARY}
            style={styles.loader}
          />
        ) : (
          <>
            <ImageBackground
              style={styles.img}
              source={require("./../../assets/images/event.jpg")}
            >
              <Text style={styles.title}>{selectedEvent?.eventName}</Text>
            </ImageBackground>
            {!hideStuff && (
              <View style={styles.info_box}>
                <Text style={styles.info_text}>Event Info</Text>
                <View style={styles.input_wrapper}>
                  <Text style={styles.input_text}>
                    {selectedEvent?.eventName}
                  </Text>
                </View>

                <View style={styles.input_wrapper}>
                  <Text style={styles.input_text}>
                    {selectedEvent?.eventPlace}
                  </Text>
                </View>

                <View style={styles.input_wrapper_2}>
                  <View style={styles.input_wrapper_2_child}>
                    <Text style={[styles.input_text, { textAlign: "center" }]}>
                      {moment(selectedEvent?.date).format("YYYY-MM-DD")}
                    </Text>
                  </View>

                  <View style={styles.input_wrapper_2_child}>
                    <Text style={[styles.input_text, { textAlign: "center" }]}>
                      {moment(selectedEvent?.time)
                        .format("h:mm a")
                        .toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {!hideStuff && (
              <View style={styles.info_box_2}>
                <View style={styles.info_box_header}>
                  <Image
                    style={[styles.invitation_img, { width: 26, height: 26 }]}
                    source={require("../../assets/images/celebration.jpg")}
                  />
                  <Text style={[styles.info_text, { marginBottom: 0 }]}>
                    {guestList?.length > 0
                      ? `Guest List (${guestList.length})`
                      : "Invite Others"}
                  </Text>
                </View>
                {guestLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.PRIMARY}
                    style={styles.loader}
                  />
                ) : (
                  <FlatList
                    data={guestList}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={renderSeparator}
                    renderItem={({ item }) => <GuestItem item={item} />}
                    ListEmptyComponent={() => (
                      <View>
                        <Text style={styles.invitation_text}>
                          Want to invite friends or relatives to the event?
                        </Text>
                        <Image
                          style={styles.invitation_img}
                          source={require("../../assets/images/celebration.jpg")}
                        />
                      </View>
                    )}
                  />
                )}

                {currentRole === "parent" && (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={async () => {
                      setShowGuestList(true);
                      await getContactList();
                    }}
                  >
                    <Text style={styles.btn_text}>Invite</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {guestList?.length > 0 ? (
              <View
                style={[styles.info_box_2, { marginTop: hideStuff ? -90 : 10 }]}
              >
                <View style={styles.info_box_header}>
                  <Image
                    style={[styles.invitation_img, { width: 26, height: 26 }]}
                    source={require("../../assets/images/comments.jpg")}
                  />
                  <Text style={[styles.info_text, { marginBottom: 0 }]}>
                    Message
                  </Text>
                </View>
                <TextInput
                  ref={messageRef}
                  placeholder="Message for SMS..."
                  style={styles.sms_message_input}
                  multiline={true}
                  numberOfLines={4}
                  editable={!smsLoading}
                  onChangeText={(val) => setMessage(val)}
                  value={message}
                  onFocus={() => setHideStuff(true)}
                />

                {currentRole === "parent" && (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={handleSendMessage}
                  >
                    <Text style={styles.btn_text}>
                      {smsLoading ? "Sending..." : "Send Message"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            <Modal visible={showGuestList} transparent={true}>
              <View style={styles.modalOverlay}>
                <View style={styles.bottomModal}>
                  <Text style={styles.info_text}>Add Guest</Text>

                  {modalLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.PRIMARY}
                      style={styles.loader}
                    />
                  ) : (
                    <FlatList
                      data={contactList.filter(
                        (x) => !checkIfInvitationExists(x)
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      ItemSeparatorComponent={renderSeparator}
                      renderItem={({ item }) => <ContactItem item={item} />}
                      ListEmptyComponent={() => (
                        <View style={styles.no_contact_text_wrapper}>
                          <Text style={styles.no_contact_text}>
                            No contacts available
                          </Text>
                        </View>
                      )}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => setShowGuestList(false)}
                  >
                    <Text style={styles.btn_text}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      </TouchableOpacity>
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
    marginTop: StatusBar.length - 80,
  },
  info_box: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    marginTop: -90,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: "28%",
  },
  info_box_2: {
    backgroundColor: Colors.WHITE,
    marginTop: 10,
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: "32%",
  },
  info_box_header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    height: 30,
    marginBottom: 20,
  },
  info_text: {
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: Colors.BLACK,
    marginBottom: 15,
  },
  input_wrapper: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    borderRadius: 10,
    padding: 10,
  },
  input_wrapper_2: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "1%",
  },
  input_wrapper_2_child: {
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    borderRadius: 10,
    padding: 10,
    width: "48.5%",
  },
  input_text: {
    fontFamily: "outfit-regular",
    fontSize: 14,
    color: Colors.GREY,
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
    marginBottom: 20,
  },
  bottomModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
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
    backgroundColor: Colors.AQUA,
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
  loader: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  invitation_text: {
    color: Colors.SHADE_BLUE,
    fontFamily: "outfit-regular",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  invitation_img: {
    width: 44,
    height: 44,
    alignSelf: "center",
  },
  contact_wrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
  },
  contact_info: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  contact_info_name: {
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  contact_info_phone: {
    fontFamily: "outfit-regular",
    fontSize: 12,
    color: Colors.GREY,
    marginTop: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  no_contact_text: {
    fontFamily: "outfit-light",
    fontSize: 18,
    color: Colors.GREY,
  },
  no_contact_text_wrapper: {
    padding: 30,
    alignItems: "center",
  },
  sms_message_input: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    borderRadius: 10,
    padding: 10,
    height: 80,
  },
});
