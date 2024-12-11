import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const { url_api } = require("../../impUrl");
const url = url_api;

const SendMoney = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Retrieve JWT from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt_token");
        if (token) {
          setJwtToken(token);
        } else {
          Alert.alert("Error", "JWT token not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching JWT token:", error);
        Alert.alert("Error", "Failed to retrieve JWT token.");
      }
    };

    fetchToken();
  }, []);

  const handleSendMoney = () => {
    if (!amount || !recipient) {
      Alert.alert("Error", "Please enter both recipient and amount.");
      return;
    }

    if (!jwtToken) {
      Alert.alert("Error", "JWT token is missing. Please log in again.");
      return;
    }

    setLoading(true); // Show loader
    axios
      .post(
        `${url}/api/transaction/send-money`,
        { recipient, amount },
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
          timeout: 10000,
        }
      )
      .then((response) => {
        console.log(response.data)
          Alert.alert("Success", `₹${amount} sent to ${recipient}.`);
          setAmount("");
          setRecipient("");
      })
      .catch((error) => {
        Alert.alert("Error",error.response.data.error);
      })
      .finally(() => {
        setLoading(false); // Hide loader
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>Bharat Transact</Text>
        </View>
        <TouchableOpacity style={styles.bellIcon}>
          <AntDesign name="bells" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Send Money</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipient Name"
          value={recipient}
          onChangeText={setRecipient}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSendMoney}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send Money</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <AntDesign name="home" size={20} color="#fff" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <AntDesign name="contacts" size={20} color="#fff" />
          <Text style={styles.footerText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <AntDesign name="wechat" size={20} color="#fff" />
          <Text style={styles.footerText}>Chat Bot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendMoney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    backgroundColor: "#3813C2CC",
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 25,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  bellIcon: {
    marginRight: 15,
  },
  formContainer: {
    paddingHorizontal: 20,
    flex: 1,
    marginBottom: 50,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#888", // Disabled button color
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004aad",
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
});
