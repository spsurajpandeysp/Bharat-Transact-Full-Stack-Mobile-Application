import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { Button } from "react-native-paper";
import axios from "axios";
import { url_api } from '../../impUrl';
const url = url_api;
const ForgetPasswordVerifyOtp = ({ navigation,route }) => {
  const {email} = route.params;
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  console.log(email)
  console.log(otp,password,confirmPassword)


  const handleSubmit = async () => {
    if (!otp || !password || !confirmPassword) {
      console.log(otp,password,confirmPassword)
      Alert.alert("Error", "All fields are required1");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/auth/api/reset-password`, {
        email,
        otp,
        newPassword:password,
        confirmNewPassword:confirmPassword
      });

      if (response.status === 200) {
        Alert.alert("Success", response.data.message || "OTP verified successfully!");
        navigation.navigate("Login"); // Adjust navigation based on your app
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    console.log(email)
    setResending(true);
    try {
      const response = await axios.post(`${url}/auth/api/forget-password`,{email});

      if (response.status === 200) {
        Alert.alert("Success", response.data.message || "OTP resent successfully!");
      }
    } catch (error) {
      Alert.alert("Error1", error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
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
            We are automatically detecting SMS sent to your registered email
          </Text>
        </View>

        <OtpInput
          numberOfDigits={4}
          onTextChange={setOtp}
          focusStickBlinkingDuration={500}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleResendCode} disabled={resending}>
            <Text style={styles.resendText}>
              {resending ? "Resending..." : "Don't receive the code? "}
              <Text style={styles.resendLink}>Resend Code</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator size="small" color="white" /> : "Okay"}
        </Button>
      </View>
      <View style={styles.leftImageContainer}>
        <Image source={require("./Vector 2.png")} style={styles.leftImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  mainContainer: {
    marginTop: 100,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
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
  },
  pinCodeText: {
    fontSize: 20,
    color: "#333",
  },
  activePinCodeContainer: {
    borderColor: "#4CAF50",
  },
  textInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    fontSize: 16,
    marginVertical: 10,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
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

export default ForgetPasswordVerifyOtp;