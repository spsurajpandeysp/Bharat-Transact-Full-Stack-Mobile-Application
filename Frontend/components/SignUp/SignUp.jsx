import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { url_api } from '../../impUrl';
const url = url_api;

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loader

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all the fields!");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
  
    setLoading(true); // Show loader
  
    axios.post(`${url}/auth/api/signup`, {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    })
      .then((response) => {
        setLoading(false);
        if (response.status === 201 || response.status === 200) {
          navigation.navigate("EmailVerifyOtp", { email });
        } else {
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        setLoading(false); 
        if (error.response) {
          if (error.response.status === 400) {
            Alert.alert("Error", error.response.data.message || "All fields are required.");
          } else if (error.response.status === 409) {
            Alert.alert("Error", error.response.data.message || "User already exists.");
          } else {
            Alert.alert("Error", "Something went wrong. Please try again.");
          }
        } else {
          Alert.alert("Error", "Unable to connect to the server. Please check your internet connection.");
        }
      });
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.topImageContainer}>
          <Image source={require("./Vector 1.png")} style={styles.topImage} />
        </View>
        <View style={styles.helloContainer}>
          <Text style={styles.helloText}>Create Account</Text>
        </View>
        <Text style={styles.signUpText}>Fill in the details below</Text>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <FontAwesome name={"user"} size={24} color={"#949A9A"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name={"user"} size={24} color={"#949A9A"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name={"envelope"} size={24} color={"#949A9A"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name={"lock"} size={24} color={"#949A9A"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name={"lock"} size={24} color={"#949A9A"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.signButtonContainer}
          onPress={handleSignup}
          disabled={loading} // Disable button while loading
        >
          <View style={styles.solidButton}>
            {loading ? (
              <ActivityIndicator size="small" color="white" /> // Loader
            ) : (
              <>
                <Text style={styles.textDesign}>Sign Up</Text>
                <AntDesign name={"arrowright"} size={24} color={"white"} />
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => navigation.navigate("Login")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;

// Styles remain the same




const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, 
  },
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
    position: "relative"
  },
  topImageContainer: {},
  topImage: {
    width: "100%",
    height: 130,
  },
  helloContainer: {},
  helloText: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "500",
    color: "#262626",
  },
  signUpText: {
    textAlign: "center",
    fontSize: 18,
    color: "#262626",
    marginBottom: 30,
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
  },
  inputIcon: {
    marginLeft: 15,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10, 
    fontSize: 16, 
  },
  signButtonContainer: {
    flexDirection: "row",
    marginTop: 40, 
    justifyContent: "flex-end",
    width: "90%",
    color: "black"
  },
  solidButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#FF5722", // Solid color (Orange Red)
    borderRadius: 25,
  },
  textDesign: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white", // White text to contrast with the solid color background
    marginRight: 10, // Space between text and icon
  },
  footerTextContainer: {
    textAlign: "center",
    marginTop: 50,
  },
  footerText: {
    color: "Black",
    textAlign: "center",
    fontSize: 15,
  },
  leftImageContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  leftImage: {
    height: 500,
    width: 230,
  }
}); 