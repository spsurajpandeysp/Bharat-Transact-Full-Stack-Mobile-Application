import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OpeningLoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        // Get the JWT token from AsyncStorage
        const jwtToken = await AsyncStorage.getItem("jwt_token");

        if (jwtToken) {
          // If JWT is present, navigate to Home
          navigation.replace("Home");
        } else {
          // If JWT is not found, navigate to Login
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error reading JWT from AsyncStorage", error);
        // If an error occurs, navigate to Login
        navigation.replace("Login");
      }
    }, 5000); // Delay for 5 seconds

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default OpeningLoadingScreen;
