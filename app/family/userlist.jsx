import { useEffect, useState } from "react";
import { 
  Alert,
  Modal,
  StyleSheet, 
  SafeAreaView,
  Text, 
  View,
} from "react-native";

// context
import { useUserProvider } from "../../contexts/UserContext";
import { useRouter } from "expo-router";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// components
import FamilyMember from "../../components/family/FamilyMember";
import HeaderLogo from "../../components/common/headerLogo";

// pin code
import { PinCode, PinCodeT } from '@anhnch/react-native-pincode';

// constants
import Keys from "@/constants/Keys";

// helper
import { hexToString } from "../../config/helper";

export default function Userlist() {
  const router = useRouter();
  const UserData = useUserProvider();

  const [pin, setPin] = useState();
  const [pinMode, setPinMode] = useState(PinCodeT.Modes.Enter);
  const [showPinModal, setShowPinModal] = useState(false);

  // console.log('=== UserList ===', UserData);

  const selectProfile = (profile, is_parent) => {
    Alert.alert('Confirm', `Are you sure you want to use the profile "${profile.name}"?`, [
      {
        text: 'Cancel',
        onPress: () => {
          console.log('Cancel Pressed');
        },
        style: 'cancel',
      },
      {text: 'OK', onPress: async () => {
        console.log('OK Pressed');
        
        try {
          await AsyncStorage.setItem(Keys.CURRENT_USER, profile.name);
          await AsyncStorage.setItem(Keys.CURRENT_ROLE, profile.role);

          // const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
          // const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);

          // console.log(`current_user: ${current_user}, current_role: ${current_role}`);
          if (is_parent) {
            setShowPinModal(true);
            return; 
          }
          router.replace("/chore");
        } catch (e) {
          console.log('Error setting current user & role to async storage:', e);
        }
      }},
    ]);
  };

  useEffect(() => {
    if (UserData?.passcode) { 
      setPin(hexToString(UserData.passcode));
    }
  }, [UserData])

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Modal
          visible={showPinModal}
          transparent={true}
        >
          <PinCode 
            pin={pin} 
            mode={pinMode} 
            visible={showPinModal}
            options={{
              allowReset: false,
              disableLock: true,
              maxAttempt: 3,
              lockDuration: 0
            }}
            styles={{ 
              main: { ...StyleSheet.absoluteFillObject, zIndex: 99 }
            }}
            onSet={newPin => {
              setPin(newPin);
              setShowPinModal(false);
            }}
            onSetCancel={() => setPinVisible(false)}
            onEnter={async () => {
              setShowPinModal(false);
              router.replace("/chore");
            }}  
          />
        </Modal>

        <HeaderLogo />
        <Text style={styles.title}>Who are you?</Text>
        <View style={styles.body_wrapper}>
          {UserData?.parents?.map((parent, index) => (
            <FamilyMember
              key={index}
              member={{ ...parent, role: "parent" }}
              onSelect={(member) => selectProfile(member, true)}
              showPoint={false}
            />
          ))}
        </View>
        <View style={styles.body_wrapper}>
          {UserData?.kids?.map((kid, index) => (
            <FamilyMember
              key={index}
              member={{ ...kid, role: "kid" }}
              onSelect={(member) => selectProfile(member, false)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  body_wrapper: {
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    alignItems: "center",
    padding: 40,
  },
  title: {
    marginTop: 30,
    fontSize: 25,
    fontFamily: "outfit-regular",
    marginBottom: 20,
  },
});
