import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // To store/retrieve the token locally
import {url_api} from '../../impUrl'
const url = url_api;
const CheckBalance = ({ navigation }) => {
  const [balance, setBalance] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user balance using JWT token
  const fetchBalance = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt_token"); // Retrieve token from storage
      if (!token) {
        throw new Error("JWT token not found. Please login.");
      }

      const response = await axios.get(`${url}/api/user/balance`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });

      // Assuming the API returns `balance` and `userName`
      setBalance(response.data.balance);
      setUserName(response.data.userName);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3813C2CC" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>Bharat Transact</Text>
        </View>

        {/* Bell Icon */}
        <TouchableOpacity style={styles.bellIcon}>
          <AntDesign name="bells" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Balance Info */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Account Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance}</Text>
        <Text style={styles.balanceUser}>{userName}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Home")}>
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

export default CheckBalance;

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
    marginTop: 25,
    marginBottom: 30,
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
  balanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 50,
    alignItems: "center",
  },
  balanceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 10,
  },
  balanceUser: {
    fontSize: 18,
    color: "#333",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
