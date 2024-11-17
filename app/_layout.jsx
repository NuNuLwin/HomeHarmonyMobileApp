import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useState } from "react";
import { SignUpContext } from "../contexts/SignUpContext";
import { UserProvider } from "../contexts/UserContext";
import { ChoreContext } from "../contexts/ChoreContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

export default function RootLayout() {
  useFonts({
    "outfit-regular": require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
    "outfit-light": require("./../assets/fonts/Outfit-Light.ttf"),
    "akaya-regular": require("./../assets/fonts/AkayaKanadaka-Regular.ttf"),
  });

  const [signUpData, setSignUpData] = useState({});
  // const [userData, setUserData] = useState({});
  const [choreData, setChoreData] = useState({});

  // console.log("=== LAYOUT INDEX ===");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SignUpContext.Provider value={{ signUpData, setSignUpData }}>
        <UserProvider>
          <ChoreContext.Provider value={{ choreData, setChoreData }}>
            <NavigationContainer>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
              </Stack>
            </NavigationContainer>
          </ChoreContext.Provider>
        </UserProvider>
      </SignUpContext.Provider>
    </GestureHandlerRootView>
  );
}
