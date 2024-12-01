import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import PieChart from '../components/PieChart'; // piechart.js josta tulee data
import { useTheme } from '../components/ThemeContext'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for testing purposes
import * as Updates from 'expo-updates';

import ServerIp from '../hooks/Global';

const HomeScreen = () => {
  const [foodHistory, setFoodHistory] = useState([]); // hardcoded 
  const [averageCalories, setAverageCalories] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(true); // loading state to track data fetching
  const { theme } = useTheme();  // Access the theme from context

  useEffect(() => {
    const fetchFoodHistory = async () => {
      try {
        const response = await fetch(ServerIp + '/get-food');

        if (response.ok) {
          const data = await response.json();
          
          const transformedData = data.map(item => ({
            id: item.id || Math.random().toString(), // Generoi id, jos sitä ei ole
            name: item.ruokanimi,
            amount: item.maarag,
            calories: item.kalorit
          }));
          setFoodHistory(transformedData);
        } else {
          console.error('Failed to fetch food history');
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // Once the data is fetched, set loading to false
      }
    };
    fetchFoodHistory();
  }, []);

  const clearCredentials = async () => { // again this function is for testing purposes and will be removed in production. will not work in web
    if(Platform.OS === 'web') {
      console.warn('This feature is not available on web, please use the browser console to clear credentials');
      return;
    }
    try {
      await SecureStore.deleteItemAsync('user'); // Clear user credentials
      await SecureStore.deleteItemAsync('isLoggedIn'); // Clear login status
      console.log('Credentials cleared');
      alert('Logging out...'); // Alert the user that they are being logged out
      await new Promise(resolve => setTimeout(resolve, 800)); // delay for 0.8 seconds so the user can see the alert
      Updates.reloadAsync(); // Reload the app after clearing credentials
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  }; // end of testing function for clearing credentials 

  useEffect(() => {
    if (foodHistory.length > 0) {
      const totalCalories = foodHistory.reduce((sum, item) => sum + item.calories, 0);
      setAverageCalories(totalCalories / foodHistory.length);
      setTotalCalories(totalCalories);
    }
  }, [foodHistory]);

  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      {/* Sign out button with icon */}
      <TouchableOpacity style={styles.clearButton} onPress={clearCredentials}>
        <Ionicons name="log-out-outline" size={30} color={theme.text.color} />
      </TouchableOpacity>

      <Text style={[styles.subtitle, { color: theme.text.color }]}>Meal diary</Text>

      {loading ? (
         <ActivityIndicator size={50} color={theme.text.color} />
        ) : foodHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text.color }]}>
            Oops, nothing added yet. Go to the diary to get started on your journey! 
            <Ionicons name="arrow-forward" size={30} color={theme.text.color} />
          </Text>
        </View>
      ) : (
        <ScrollView>
          <FlatList
            data={foodHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.item, { borderBottomColor: theme.borderColor }]}>
                <Text style={{ color: theme.text.color }}>
                  {item.date}: {item.name}, {item.amount}g, {item.calories} calories
                </Text>
              </View>
            )}
          />
          <Text style={[styles.averageText, { color: theme.text.color }]}>
            The calories of your average meal: {averageCalories.toFixed(2)} calories
          </Text>
          <Text style={[styles.totalText, { color: theme.text.color}]}>
            Total calories consumed: {totalCalories.toFixed(2)} calories
          </Text>
          <Text style={[styles.pieTitle, { color: theme.text.color }]}>Your last five meals</Text>
          <PieChart data={foodHistory} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, margin: 1 },
  title: { fontSize: 24, textAlign: 'center', margin: 10, fontWeight: 'bold' },
  subtitle: { fontSize: 20, marginVertical: 10, fontWeight: '600' },
  item: { padding: 10, borderBottomWidth: 1 },
  averageText: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  totalText: { marginTop: 10, fontSize: 18, fontWeight: 'bold' },
  pieTitle: { marginTop: 20, fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  clearButton: { padding: 10, backgroundColor: 'transparent', borderRadius: 5, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: 'blue', textAlign: 'center' }
});

export default HomeScreen;
