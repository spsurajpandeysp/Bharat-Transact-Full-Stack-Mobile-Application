import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Platform,
  Alert,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { Button } from "react-native-paper";
import axios from "axios";
import { url_api } from '../../impUrl';

const url = url_api;

const EmailVerifyOtp = ({ route, navigation }) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const email = route.params?.email; // Assuming email is passed via navigation params
  const prevPath = route.params?.from;

  // Validate OTP
  const validateOtp = () => {
    const otpRegex = /^\d{4}$/; // Ensures OTP is exactly 4 digits
    return otpRegex.test(otp);
  };

  const submitHandle = async () => {
    if (!validateOtp()) {
      Alert.alert("Validation Error", "Please enter a valid 4-digit OTP.");
      return;
    }

    setIsSubmitting(true);

    axios.post(`${url}/auth/api/email-verify`, { email, otp })
      .then((response) => {
          Alert.alert("Success", "Email verified successfully!");
          navigation.replace("Login");

      })
      .catch((error) => {
        Alert.alert("Error", error.response?.data?.message || "An error occurred during OTP verification.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (prevPath === "LoginPage") {
      resendHandle();
    }
  }, []);

  const resendHandle = () => {
    setIsResending(true);

    axios.post(`${url}/auth/api/resend-email-verify-otp`, { email })
      .then((response) => {
          Alert.alert("Message", "OTP resent successfully!");
 
      })
      .catch((error) => {
        Alert.alert("Error", error.response?.data?.message || "An error occurred while resending OTP.");
      })
      .finally(() => {
        setIsResending(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image source={require("./Vector 1.png")} style={styles.topImage} />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subTitle}>
            We are automatically detecting Mail sent to your registered email
          </Text>
        </View>

        <OtpInput
          numberOfDigits={4}
          onTextChange={(text) => setOtp(text)}
          focusStickBlinkingDuration={500}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />

        <View style={styles.footer}>
          <TouchableOpacity onPress={resendHandle} disabled={isResending}>
            <Text style={styles.resendText}>
              Don't receive the code? <Text style={styles.resendLink}>{isResending ? "Resending..." : "Resend Code"}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          style={styles.button}
          onPress={submitHandle}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Okay"}
        </Button>
      </View>
      <View style={styles.leftImageContainer}>
        <Image source={require("./Vector 2.png")} style={styles.leftImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    marginTop: 100,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  topImageContainer: {},
  topImage: {
    width: "100%",
    height: 130,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  pinCodeContainer: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    width: 50,
    height: 50,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    elevation: Platform.OS === "android" ? 5 : 0, // Use only elevation for animation
  },
  pinCodeText: {
    fontSize: 20,
    color: "#333",
  },
  activePinCodeContainer: {
    borderColor: "#4CAF50",
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
  },
  resendText: {
    fontSize: 14,
    color: "#333",
  },
  resendLink: {
    color: "#FF5722",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#FF5722",
    borderRadius: 25,
  },
  leftImageContainer: {
    position: "relative",
    bottom: 0,
    left: 0,
  },
  leftImage: {
    height: 290,
    width: 300,
  },
});

export default EmailVerifyOtp;
