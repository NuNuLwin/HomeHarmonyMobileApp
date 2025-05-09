import { View, Text, SafeAreaView, Image, StyleSheet } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "expo-router";
import { SignUpContext } from "../../../contexts/SignUpContext";

// Components
import Progressindicator from "../../../components/signup/Progressbar";
import CreateAccount from "../../../components/signup/CreateAccount";
import CreateParentsProfile from "../../../components/signup/CreateParentsProfile";
import CreateKidProfile from "../../../components/signup/CreateKidProfile";
import FooterButtons from "../../../components/signup/FooterButtons";
import Colors from "../../../constants/Colors";
import BackButton from "../../../components/signup/BackButton";

export default function SignUp() {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const { signUpData, setSignUpData } = useContext(SignUpContext);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      backgroundColor: Colors.WHITE,
    });
  });

  const handleNextButtonPressed = () => {
    let flag = true;

    // Input text validation
    if (step === 0) {
      const _email = signUpData?.email;
      const _password = signUpData?.password;
      const _passcode = signUpData?.passcode;

      if (!_email || !_password || !_passcode) {
        flag = false;
      }
    }

    if (step === 1 || step === 2) {
      const _parentProfile = signUpData?.parents?.[step - 1];
      const _name = _parentProfile?.name;
      const _dob = _parentProfile?.dob;
      const _gen = _parentProfile?.gender;
      const _image = _parentProfile?.image;
      console.log("_parentProfile:", _parentProfile);

      if (!_name || !_dob || !_gen || !_image) {
        flag = false;
      }
    }

    if (!flag) {
      alert("Please fill required data!");
    }

    if (flag && step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePreviousButtonPressed = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.WHITE }}>
      <View style={styles.container}>
        {/* {step > 0 && <BackButton onPressed={handlePreviousButtonPressed} />} */}
        {step === 0 && <BackButton />}
        {step === 0 && (
          <View>
            <Progressindicator size="0.25" />
            <CreateAccount />
          </View>
        )}
        {step === 1 && (
          <View>
            <Progressindicator size="0.5" />
            <CreateParentsProfile step="2" />
          </View>
        )}
        {step === 2 && (
          <View>
            <Progressindicator size="0.75" />
            <CreateParentsProfile step="3" />
          </View>
        )}
        {step === 3 && (
          <View>
            <Progressindicator size="1.0" />
            <CreateKidProfile onSignUp={() => setIsProcessing(!isProcessing)} />
          </View>
        )}

        <FooterButtons
          showBackButton={step > 0 && !isProcessing}
          handleBackButtonClicked={handlePreviousButtonPressed}
          showNextButton={step < 3 && !isProcessing}
          handleNextButtonClicked={handleNextButtonPressed}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    justifyContent: "flex-start",
    padding: 30,
    gap: 20,
    height: "100%",
  },
  btn_container: {
    justifyContent: "space-between",
    flexDirection: "row",
  },

  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  nextButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
});
