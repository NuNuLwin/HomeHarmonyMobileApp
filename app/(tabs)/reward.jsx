import { useEffect, useState } from "react";
import { View, SafeAreaView, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// components
import Header from "../../components/reward/Header";
import Menu from "../../components/reward/Menu";
import Redeemed from "../../components/reward/Redeemed";

// constants
import Colors from "@/constants/Colors";
import Keys from "@/constants/Keys";

export default function reward() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  const GetCurrentUser = async () => {
    const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
    setCurrentUser(current_user);

    const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
    setCurrentRole  (current_role);

    setLoading(false);
  }

  // events
  const handleRewardMenuClick = () => {
    router.push({ pathname: "/reward/rewardScreen" });
  };
  const handleRedeemedMenuClick = () => {
    router.push({ pathname: "/reward/redeemedScreen" });
  };

  useEffect(() => {
    GetCurrentUser();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {loading ? <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        /> : <>
          <Header />
          <Menu
            handleRewardMenuClick={handleRewardMenuClick}
            handleRedeemedMenuClick={handleRedeemedMenuClick}
            currentUser={currentUser}
            currentRole={currentRole}
          />
          <Redeemed 
            currentUser={currentUser}
            currentRole={currentRole}
          />
        </>}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
});
