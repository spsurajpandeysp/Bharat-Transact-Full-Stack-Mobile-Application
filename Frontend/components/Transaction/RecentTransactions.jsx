import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url_api } from '../../impUrl';
const url = url_api

const RecentTransactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Retrieve the JWT token from AsyncStorage
        const token = await AsyncStorage.getItem('jwt_token');
        if (!token) {
          console.error('JWT not found in AsyncStorage');
          setLoading(false);
          return;
        }

        // Fetch transactions from the server
        const response = await axios.get(`${url}/api/transaction/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransactions(response.data.transactions || []);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>
        <Text style={styles.bold}>{item.toUser.firstName} {item.toUser.lastName}</Text> received ₹{item.amount}
      </Text>
      <Text style={styles.transactionDate}>Transaction ID: {item.transactionId}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004aad" />
        <Text>Loading transactions...</Text>
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

      <Text style={styles.title}>Recent Transactions</Text>

      {/* Recent Transactions List */}
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.transactionId}
          contentContainerStyle={styles.transactionsList}
        />
      ) : (
        <Text style={styles.noTransactions}>No transactions found.</Text>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
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

export default RecentTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  header: {
    backgroundColor: '#3813C2CC',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 25,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bellIcon: {
    marginRight: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },

  transactionsList: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  transactionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  transactionText: {
    fontSize: 16,
    color: '#333',
  },

  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },

  bold: {
    fontWeight: 'bold',
  },

  noTransactions: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#004aad',
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});
