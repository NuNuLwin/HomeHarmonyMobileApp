import { useEffect, useState } from "react";
import { 
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// router
import { useRouter, useNavigation } from "expo-router";

// firebase
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// contacts
import * as Contacts from "expo-contacts";

// constants
import Colors from "../../constants/Colors";
import Keys from "../../constants/Keys";

import moment from "moment";

export default function eventDetail () {
  const navigation = useNavigation();

  const [currentRole, setCurrentRole] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [showGuestList, setShowGuestList] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

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

    data.forEach(x => {
      let firstName = x.firstName || "";
      let lastName = x.lastName || "";
      let phones = [];

      x.phoneNumbers?.forEach(y => phones.push(y.number));
      // console.log(`firstName: ${firstName}, lastName: ${lastName}, phones: ${phones}`);

      if (phones) {
        let item = {
          first_name: firstName,
          last_name: lastName,
          phones
        };
        if (!checkIfInvitationExists(item)) {
          _contactList.push(item);
        }
      }
    });
    _contactList.sort((a, b) => a.first_name.localeCompare(b.first_name));
    setContactList(_contactList);
    setTimeout(() => setModalLoading(false), 1000);
  }

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
    } finally {
      setGuestLoading(false);
    }
  }

  const checkIfInvitationExists = (item) => {

    if (!guestList) return false;

    return guestList.some(
      guest => guest.first_name === item.first_name && guest.last_name === item.last_name
    );
  }

  /* Components */
  const GuestItem = ({ item }) => {
    return (
      <View style={styles.contact_wrapper}>
        <View style={styles.contact_info}>
          <Text style={styles.contact_info_name}>{`${item.first_name} ${item.last_name}`}</Text>
          <Text style={styles.contact_info_phone}>{item.phones ? item.phones.join(", ") : ""}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteIcon}
        >
          <Image
            style={styles.icon}
            source={require("../../assets/images/delete.png")}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const ContactItem = ({ item }) => {
    return (
      <View style={styles.contact_wrapper}>
        <View style={styles.contact_info}>
          <Text style={styles.contact_info_name}>{`${item.first_name} ${item.last_name}`}</Text>
          <Text style={styles.contact_info_phone}>{item.phones ? item.phones.join(", ") : ""}</Text>
        </View>
        {checkIfInvitationExists(item) ? (
          <></>  
        ) : (<TouchableOpacity
          onPress={() => handleInviteClicked(item)}
        >
          <Text style={styles.invitation_text}>Add</Text>
        </TouchableOpacity>)}
      </View>
    )
  }

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
      <SafeAreaView style={styles.container}>
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
                      {moment(selectedEvent?.date).format('h:mm a').toUpperCase()}
                  </Text>
                </View>
              </View>
          </View>

          <View style={styles.info_box_2}>
              <Text style={styles.info_text}>Invite Others</Text>

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
                    renderItem={({item}) => (
                      <GuestItem
                        item={item}
                      />
                    )}
                    ListEmptyComponent={() => (
                      <View>
                        <Text style={styles.invitation_text}>Want to invite friends or relatives to the event?</Text>
                        <Image
                          style={styles.invitation_img}
                          source={require('../../assets/images/celebration.jpg')}
                        />
                      </View>
                    )}
                  />
                )}

            {currentRole === "parent" && <TouchableOpacity style={styles.btn} onPress={async () => { 
              setShowGuestList(true);
              await getContactList();
            }}>
              <Text style={styles.btn_text}>Invite</Text>
            </TouchableOpacity>}
          </View>

          <Modal
            visible={showGuestList}
            transparent={true}
          >
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
                    data={contactList.filter(x => !checkIfInvitationExists(x))}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={renderSeparator}
                    renderItem={({ item }) => (
                      <ContactItem
                        item={item}
                      />
                    )}
                    ListEmptyComponent={() => (
                      <View style={styles.no_contact_text_wrapper}>
                        <Text style={styles.no_contact_text}>No contacts available</Text>
                      </View>
                    )}
                  />
                )}

                <TouchableOpacity style={styles.btn} onPress={() => setShowGuestList(false)}>
                  <Text style={styles.btn_text}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
        )}
      </SafeAreaView>
  )

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
    width: '48.5%'
  },
  input_text: {
    fontFamily: "outfit-regular",
    fontSize: 14,
    color: Colors.GREY
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
    height: "50%",
    marginBottom: 20,
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
    alignSelf: "center"
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
    color: Colors.GREY 
  },
  no_contact_text_wrapper: { 
    padding: 30, 
    alignItems: "center" 
  },
});