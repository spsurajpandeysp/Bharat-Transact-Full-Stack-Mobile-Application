import React, { useState } from "react";
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { url_api } from '../../impUrl';
const url = url_api;
const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter a email address");
      return;
    }

    setLoading(true);

    try {
      // Replace the URL below with your actual API endpoint
      const response = await axios.post(`${url}/auth/api/forget-password`, {
        email: email,
      });

      if (response.status === 200) {
        // Alert.alert("Success", response.data.message || "Verification email sent successfully!");
        navigation.navigate("ForgetPasswordVerifyOtp",{email}); // Adjust to your navigation flow
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert("Error", "Account not found. Please check your email address.1");
      } else {
        Alert.alert("Error", error.response?.data?.message || "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image source={require("./Vector 1.png")} style={styles.topImage} />
      </View>
      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Forgot Password</Text>
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name={"envelope"} size={24} color={"#949A9A"} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity
        style={styles.signButtonContainer}
        onPress={handleNext}
        disabled={loading} // Disable button while loading
      >
        <View style={styles.solidButton}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Text style={styles.textDesign}>Verify</Text>
              <AntDesign name={"arrowright"} size={24} color={"white"} />
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
    position: "relative",
  },
  topImageContainer: {},
  topImage: {
    width: "100%",
    height: 130,
  },
  helloContainer: { marginTop: 10 },
  helloText: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "500",
    color: "#262626",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 15,
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    marginTop: 120,
  },
  inputIcon: {
    marginLeft: 15,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  signButtonContainer: {
    flexDirection: "row",
    marginTop: 40,
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
  },
  solidButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FF5722",
    borderRadius: 25,
  },
  textDesign: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
  },
});
