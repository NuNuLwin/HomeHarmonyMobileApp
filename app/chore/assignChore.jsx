import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import Colors from "../../constants/Colors";
import Kids from "../../components/reward/kids";
import { UserContext } from "../../contexts/UserContext";
import RecommendedChores from "../../components/chore/assign/RecommendedChores";
import { useNavigation } from "expo-router";
import CustomizedChores from "../../components/chore/assign/CustomizedChores";

export default function AssignChore() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [selectedKid, setSelectedKid] = useState();
  const { userData } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData?.kids) {
      if (userData.currentRole === "kid") {
        const currentKid = userData.kids.find(
          (kid) => kid.name === userData.currentUser
        );
        setSelectedKid(currentKid);
      } else if (userData.currentRole === "parent") {
        setSelectedKid(userData.kids[0]);
      }
    }

    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Assign Chore/Task",
      headerBackTitle: "Home",
    });
  }, [userData.currentRole, userData.currentUser, userData.kids]);

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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Who would you like to assign?</Text>
          <ScrollView horizontal={true}>
            <Kids
              onSelect={onSelectedKid}
              selectedKid={selectedKid}
              showPoint={false}
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
});
