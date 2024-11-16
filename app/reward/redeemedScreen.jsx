import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView, 
  StyleSheet,
  View
} from "react-native";
import { useNavigation } from "expo-router";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// context
import { useUserProvider } from "../../contexts/UserContext";

// components
import Kids from "../../components/reward/kids";
import Redeemed from "../../components/reward/Redeemed";

// constants
import Colors from "../../constants/Colors";
import Keys from "../../constants/Keys";

export default function RedeemedScreen() {
  const navigation = useNavigation();
  const userData = useUserProvider();
  const [selectedKid, setSelectedKid] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  const GetCurrentUser = async () => {
    const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
    setCurrentUser(current_user);

    const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
    setCurrentRole  (current_role);

    setIsLoading(false);
  }

  useEffect(() => {
    GetCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentRole || !userData || !currentUser) return

    if (currentRole === "kid" && userData?.kids) {
      const currentKid = userData.kids.find(
        (kid) => kid.name === currentUser
      );
      setSelectedKid(currentKid);
    } else if (currentRole === "parent" && userData?.kids) {
      setSelectedKid(userData.kids[0]);
    }
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Redeemed",
      headerBackTitle: "Back",
    });
  }, [currentRole, currentUser, userData]);

  const OnSelectedKid = (kid) => {
    setSelectedKid(kid);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ): (
        <View style={styles.container}>
          <Kids
            onSelect={OnSelectedKid}
            selectedKid={selectedKid}
            showPoint={true}
            currentRole={currentRole}
          />
          <Redeemed 
            selectedKid={selectedKid}
            currentUser={currentUser}
            currentRole={currentRole}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
  },
  footer: {
    marginBottom: 20,
  },
  modal_wrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modal_container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
  },
  loader: {
    marginTop: "50%",
    marginBottom: 20,
    alignSelf: "center",
  },
});
