import { View, Text, SafeAreaView, Image, StyleSheet } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, useRouter } from "expo-router";
import { SignUpContext } from "../../../contexts/SignUpContext";

// Components
import Progressindicator from "../../../components/signup/Progressbar";
import CreateAccount from "../../../components/signup/CreateAccount";
import CreateParentsProfile from "../../../components/signup/CreateParentsProfile";
import CreateKidProfile from "../../../components/signup/CreateKidProfile";
import FooterButtons from "../../../components/signup/FooterButtons";
import Colors from "../../../constants/Colors";

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [step, setStep] = useState(0);

  const { signUpData, setSignUpData } = useContext(SignUpContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleNextButtonPressed = () => {
    let flag = true;

    // Input text validation
    if (step === 0) {
      const _email = signUpData?.email;
      const _password = signUpData?.password;

      if (!_email || !_password) {
        flag = false;
      }
    }

    if (step === 1 || step === 2) {
      const _parentProfile = signUpData?.parents?.[step - 1];
      const _name = _parentProfile?.name;
      const _dob = _parentProfile?.dob;
      const _gen = _parentProfile?.gender;

      if (!_name || !_dob || !_gen) {
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
    <SafeAreaView>
      <View style={styles.container}>
        {/* {step > 0 && <BackButton onPressed={handlePreviousButtonPressed} />} */}

        {step === 0 && (
          <View>
            <Progressindicator size="0.25" />
            <Text>Step 1</Text>
            <CreateAccount />
          </View>
        )}
        {step === 1 && (
          <View>
            <Progressindicator size="0.5" />
            <Text>Step 2</Text>
            <CreateParentsProfile step="2" />
          </View>
        )}
        {step === 2 && (
          <View>
            <Progressindicator size="0.75" />
            <Text>Step 3</Text>
            <CreateParentsProfile step="3" />
          </View>
        )}
        {step === 3 && (
          <View>
            <Progressindicator size="1.0" />
            <Text>Step 4</Text>
            <CreateKidProfile />
          </View>
        )}

        <FooterButtons
          showBackButton={step > 0}
          handleBackButtonClicked={handlePreviousButtonPressed}
          showNextButton={step < 3}
          handleNextButtonClicked={handleNextButtonPressed}
        />

        {/* Sign in button */}
        {/* <TouchableOpacity onPress={handleSignUp} style={styles.signup_button}>
          <Text style={[styles.text, styles.text_style]}>Sign up</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    justifyContent: "space-between",
    padding: 30,
    gap: 20,
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
