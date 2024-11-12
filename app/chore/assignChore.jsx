import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import Colors from "../../constants/Colors";
import Kids from "../../components/reward/kids";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "../../contexts/UserContext";
import RecommendedChores from "../../components/chore/assign/RecommendedChores";
import { ChoreContext } from "../../contexts/ChoreContext";

export default function AssignChore() {
  const navigation = useNavigation();
  const [selectedKid, setSelectedKid] = useState();
  const { userData } = useContext(UserContext);
  const { choreData } = useContext(ChoreContext);

  // States for collapsible animations
  const [recommendedHeight] = useState(new Animated.Value(0));
  const [customHeight] = useState(new Animated.Value(0));
  const [isRecommendedOpen, setIsRecommendedOpen] = useState(true);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  useEffect(() => {
    if (userData.currentRole === "kid" && userData?.kids) {
      const currentKid = userData.kids.find(
        (kid) => kid.name === userData.currentUser
      );
      setSelectedKid(currentKid);
    } else if (userData.currentRole === "parent" && userData?.kids) {
      setSelectedKid(userData.kids[0]);
    }

    console.log("========selectedKid=========", selectedKid);

    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Assign Chore/Task",
      headerBackTitle: "Home",
    });

    Animated.timing(recommendedHeight, {
      toValue: 400,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  const OnSelectedKid = (kid) => {
    setSelectedKid(kid);
  };

  const toggleRecommended = () => {
    setIsRecommendedOpen(!isRecommendedOpen);

    // Close the Custom box if Recommended is opened
    if (!isRecommendedOpen) {
      setIsCustomOpen(false);
      Animated.timing(customHeight, {
        toValue: 0, // Close Custom section
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    Animated.timing(recommendedHeight, {
      toValue: isRecommendedOpen ? 0 : 400,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleCustom = () => {
    setIsCustomOpen(!isCustomOpen);

    // Close the Recommended box if Custom is opened
    if (!isCustomOpen) {
      setIsRecommendedOpen(false);
      Animated.timing(recommendedHeight, {
        toValue: 0, // Close Recommended section
        duration: 400,
        useNativeDriver: false,
      }).start();
    }

    Animated.timing(customHeight, {
      toValue: isCustomOpen ? 0 : 400,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Who would you like to assign?</Text>
          <ScrollView horizontal={true}>
            <Kids
              onSelect={OnSelectedKid}
              selectedKid={selectedKid}
              showPoint={false}
            />
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View onPress={toggleRecommended} style={styles.box}>
          <TouchableOpacity
            onPress={toggleRecommended}
            style={styles.chore_header}
          >
            <Text style={[styles.title, { color: "#025284" }]}>
              Recommended for {selectedKid?.name} ({choreData.minAge} -
              {choreData.maxAge} yrs )
            </Text>
            <TouchableOpacity onPress={toggleRecommended}>
              <Text style={styles.collapseBtn}>
                {isRecommendedOpen ? (
                  <Ionicons name="caret-down" size={24} color="black" />
                ) : (
                  <Ionicons name="caret-up" size={24} color="black" />
                )}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <Animated.View
            style={{ height: recommendedHeight, overflow: "hidden" }}
          >
            <RecommendedChores selectedKid={selectedKid} />
          </Animated.View>
        </View>

        {/* Custom Section */}
        <TouchableOpacity onPress={toggleCustom} style={styles.box}>
          <View style={[styles.chore_header, styles.custom_color]}>
            <Text style={[styles.title, { color: "#C16300" }]}>Custom</Text>
            <TouchableOpacity onPress={toggleCustom}>
              <Text style={styles.collapseBtn}>
                {isCustomOpen ? (
                  <Ionicons name="caret-down" size={24} color="black" />
                ) : (
                  <Ionicons name="caret-up" size={24} color="black" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
          <Animated.View style={{ height: customHeight, overflow: "hidden" }}>
            {/* Additional Custom Chore Cards Here */}
          </Animated.View>
        </TouchableOpacity>
      </View>
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
    backgroundColor: Colors.LIGHT_BLUE,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  box: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    borderRadius: 10,
    flexDirection: "column",
  },
  chore_header: {
    backgroundColor: "#A8DEFF",
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  custom_color: {
    backgroundColor: "#F5CEA5",
  },
  collapseBtn: {
    fontFamily: "outfit-medium",
    fontSize: 14,
    color: "#025284",
  },

  title: { fontFamily: "outfit-medium", fontSize: 16 },
});
