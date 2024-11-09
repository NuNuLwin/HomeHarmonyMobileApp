import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useState } from "react";
import { SignUpContext } from "../contexts/SignUpContext";
import { UserContext } from "../contexts/UserContext";

export default function RootLayout() {
  useFonts({
    "outfit-regular": require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
    "outfit-light": require("./../assets/fonts/Outfit-Light.ttf"),
    "akaya-regular": require("./../assets/fonts/AkayaKanadaka-Regular.ttf"),
  });

  const [signUpData, setSignUpData] = useState({});
  const [userData, setUserData] = useState({});

  return (
    <SignUpContext.Provider value={{ signUpData, setSignUpData }}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </UserContext.Provider>
    </SignUpContext.Provider>
  );
}
