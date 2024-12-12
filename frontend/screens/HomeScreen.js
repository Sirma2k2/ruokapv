import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import PieChart from '../components/PieChart'; // piechart.js josta tulee data
import { useTheme } from '../components/ThemeContext'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for testing purposes
import * as Updates from 'expo-updates';
import CalorieTracker from '../components/CalorieTracker';
import GetCalories from '../hooks/GetCalories'; // Import GetCalories hook
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

import ServerIp from '../hooks/Global';

const HomeScreen = () => {
  const [foodHistory, setFoodHistory] = useState([]); // hardcoded 
  const [averageCalories, setAverageCalories] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const { theme } = useTheme();  // Access the theme from context

  const { caloriesData, loading, error, fetchCalories } = GetCalories(); // Use GetCalories hook

  const fetchFoodHistory = async () => {
    try {
      const storedData = await SecureStore.getItemAsync("userData");
      const parsedData = JSON.parse(storedData);
      const response = await fetch(ServerIp + '/get-food',{
        headers: {
          knimi: parsedData[0]?.knimi,
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        const transformedData = data.map(item => ({
          id: item.id || Math.random().toString(), // Generoi id, jos sitä ei ole
          name: item.ruokanimi,
          amount: item.maarag,
          calories: item.kalorit,
          type: 'food',
          picture: item?.picture // Use placeholder if no valid URL
        }));
        setFoodHistory(transformedData);
      } else {
        console.error('Failed to fetch food history');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFoodHistory();
      fetchCalories(); // Ensure the calorie tracker data is also refreshed
    }, [])
  );

  const clearCredentials = async () => { // This became a logging out function will not work in web
    if(Platform.OS === 'web') {
      console.warn('This feature is not available on web, please use the browser console to clear credentials');
      return;
    }
    try {
      await SecureStore.deleteItemAsync('user'); // Clear user credentials
      await SecureStore.deleteItemAsync('isLoggedIn'); // Clear login status
      console.log('Credentials cleared and logging out...'); // Log that the credentials have been cleared
      alert('Logging out...'); // Alert the user that they are being logged out
      await new Promise(resolve => setTimeout(resolve, 800)); // delay for 0.8 seconds so the user can see the alert
      Updates.reloadAsync(); // Reload the app after clearing credentials
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  }; // end of function for clearing credentials 

  useEffect(() => {
    if (foodHistory.length > 0) {
      const totalCalories = foodHistory.reduce((sum, item) => sum + item.calories, 0);
      setAverageCalories(totalCalories / foodHistory.length);
      setTotalCalories(totalCalories);
      
    }
  }, [foodHistory]);

  const renderItem = ({ item }) => {
    if (item.type === 'food') {
      return (
        <View style={[styles.item, { borderBottomColor: theme.borderColor }]}>
          <Text style={{ color: theme.text.color }}>
            {item.date}: {item.name}, {item.amount}g, {item.calories} calories
          </Text>
        </View>
      );
    } else if (item.type === 'pieChart') {
      return <PieChart data={foodHistory} />;
    }
    return null;
  };

  const combinedData = [
    ...foodHistory.slice(-10),
    { id: 'pieChart', type: 'pieChart' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearCredentials}>
        <Ionicons 
          name="log-out-outline" 
          size={20} 
          color={theme.text.color} 
          style={{ transform: [{ rotate: '180deg' }] }} 
        />
        <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color={theme.text.color} />
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          <View style={styles.calorieTrackerWrapper}>
            <CalorieTracker goal={caloriesData.goal} food={caloriesData.food} remaining={caloriesData.remaining} />
          </View>
        )}
      </View>
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
        <FlatList
          data={combinedData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={() => (
            <>
              <Text style={[styles.averageText, { color: theme.text.color }]}>
                The calories of your average meal: {averageCalories.toFixed(2)} calories
              </Text>
              <Text style={[styles.totalText, { color: theme.text.color}]}>
                Total calories logged: {totalCalories.toFixed(2)} calories
              </Text>
            </>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  title: { fontSize: 24, textAlign: 'center', margin: 10, fontWeight: 'bold' },
  subtitle: { fontSize: 20, marginVertical: 10, fontWeight: '600' },
  item: { padding: 10, borderBottomWidth: 1 },
  averageText: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  totalText: { marginTop: 10, fontSize: 18, fontWeight: 'bold' },
  pieTitle: { marginTop: 20, fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  clearButton: { padding: 1, backgroundColor: 'transparent', borderRadius: 5, marginTop: -14, alignSelf: 'flex-start', alignItems: 'center', marginRight: 10, marginLeft: -8,},
  buttonText: { color: 'blue', textAlign: 'center' },
  topContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calorieTrackerWrapper: { marginLeft: -35, marginRight: 30, marginTop: 13,  }, // Adjusted marginLeft
  logoutText: {fontSize: 10, marginTop: -2.5,},
});

export default HomeScreen;