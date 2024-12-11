import { ActivityIndicator, Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign"; 
import axios from "axios";
import { url_api } from '../../impUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = url_api;

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleLogin = () => {
    // Prevent further clicks while processing
    if (loading) return;

    // Check if both email and password are provided
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password!");
      return;
    }

    setLoading(true); // Start loading
    axios.post(`${url}/auth/api/login`, { email, password })
      .then(async (response) => {
        const jwt = response.data.token;
        if (jwt) {
          await AsyncStorage.setItem("jwt_token", jwt);
          navigation.navigate("Home");
        } else {
          Alert.alert("Error", "Invalid credentials or no token returned.");
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes("User not found")) {
            Alert.alert("Error", "User not found. Please check your email.");
          } else if (errorMessage.includes("Invalid credentials")) {
            Alert.alert("Error", "Invalid password. Please try again.");
          } else if (errorMessage.includes("Please verify your email before logging in.")) {
            Alert.alert("Error", "Please verify your email before logging in.");
            navigation.navigate("EmailVerifyOtp",{email,from:"LoginPage"})
          } else {
            Alert.alert("Error", errorMessage || "Login failed. Please try again later.");
          }
        } else {
          Alert.alert("Error", "Unable to connect to the server. Please try again later.");
        }
      })
      .finally(() => setLoading(false)); // Stop loading
  };

  const handleCreateAccount = () => {
    navigation.navigate("SignUp"); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image
          source={require("./Vector 1.png")}
          style={styles.topImage}
        />
      </View>
      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Bharat Transact</Text>
      </View>
      <View>
        <Text style={styles.signInText}>Sign in to your account</Text>
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name={"user"} size={24} color={"#949A9A"} style={styles.inputIcon} />
        <TextInput onChangeText={setEmail} style={styles.textInput} placeholder="Email" />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name={"lock"} size={24} color={"#949A9A"} style={styles.inputIcon} />
        <TextInput onChangeText={setPassword} style={styles.textInput} placeholder="Password" secureTextEntry />
      </View>
      <View>
        <Text 
          onPress={() => navigation.navigate('ForgotPassword')} 
          style={styles.forgotPass}
        >
          Forgot Your Password?
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.signButtonContainer} 
        onPress={handleLogin} 
        disabled={loading} // Disable button during loading
      >
        <View style={styles.solidButton}>
          {loading ? (
            <ActivityIndicator size="small" color="white" /> // Show loader
          ) : (
            <>
              <Text style={styles.textDesign}>Sign In</Text>
              <AntDesign name={"arrowright"} size={24} color={"white"} />
            </>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>
          Don't Have An Account 
          <Text style={{ textDecorationLine: "underline" }} onPress={handleCreateAccount}> Create One</Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
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
  signInText: {
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
    marginVertical: 20,
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
  forgotPass: {
    fontSize: 15,
    textAlign: "right",
    marginRight: 20,
    marginTop: 25,
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
    backgroundColor: "#FF5722", 
    borderRadius: 25,
  },
  textDesign: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    marginRight: 10, 
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
    zIndex:0,
    bottom: 0,
    left: 0,
  },
  leftImage: {
    height: 500,
    width: 230,
  }
});
