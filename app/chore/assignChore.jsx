import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ActivityIndicator,
} from "react-native";
import { TabView } from "react-native-tab-view";

// context
import { useUserProvider } from "../../contexts/UserContext";

// router
import { useNavigation } from "expo-router";

// async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// components
import CustomizedChores from "../../components/chore/assign/CustomizedChores";
import Kids from "../../components/reward/kids";
import RecommendedChores from "../../components/chore/assign/RecommendedChores";

// constants
import Colors from "../../constants/Colors";
import Keys from "../../constants/Keys";

export default function AssignChore() {
  const layout = useWindowDimensions();
  const userData = useUserProvider();
  const navigation = useNavigation();

  const [index, setIndex] = useState(0);
  const [selectedKid, setSelectedKid] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const GetCurrentUser = async () => {
    try {
      const current_user = await AsyncStorage.getItem(Keys.CURRENT_USER);
      setCurrentUser(current_user);

      const current_role = await AsyncStorage.getItem(Keys.CURRENT_ROLE);
      setCurrentRole(current_role);
    } catch (error) {
      console.log("Error getting current user from async storage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCurrentUser();
  }, []);

  useEffect(() => {
    if (currentRole && currentUser && userData?.kids) {
      if (currentRole === "kid") {
        const currentKid = userData.kids.find(
          (kid) => kid.name === currentUser
        );
        setSelectedKid(currentKid);
      } else if (currentRole === "parent") {
        setSelectedKid(userData.kids[0]);
      }
    }

    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Assign Chore/Task",
      headerBackTitle: "Home",
    });
  }, [currentRole, currentUser, userData.kids]);

  const onSelectedKid = (kid) => {
    setSelectedKid(kid);
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <RecommendedChores selectedKid={selectedKid} />;
      case "second":
        return <CustomizedChores selectedKid={selectedKid} />;
      default:
        return null;
    }
  };

  const routes = [
    { key: "first", title: "Recommended" },
    { key: "second", title: "Customized" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Who would you like to assign?</Text>
              <ScrollView horizontal={true}>
                <Kids
                  onSelect={onSelectedKid}
                  selectedKid={selectedKid}
                  showPoint={false}
                  currentRole={currentRole}
                />
              </ScrollView>
            </View>
          </View>
          <TabView
            // swipeEnabled={false}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            // tabBarPosition="bottom"
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
    backgroundColor: Colors.WHITE,
  },
  header: {
    // backgroundColor: Colors.LIGHT_BLUE,
    padding: 10,
    borderRadius: 10,
    // alignItems: "center",
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
});
