import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PieChart from '../components/PieChart'; // piechart.js josta tulee data

const HomeScreen = () => {
  const [foodHistory, setFoodHistory] = useState([
    { id: '1', name: 'Omena', amount: 150, calories: 80, date: '2024-11-01', color: '#FF6384' },
    { id: '2', name: 'Kananrinta', amount: 200, calories: 350, date: '2024-11-02', color: '#36A2EB' },
    { id: '3', name: 'Riisi', amount: 180, calories: 220, date: '2024-11-03', color: '#FFCE56' },
    { id: '4', name: 'Salaatti', amount: 100, calories: 50, date: '2024-11-04', color: '#4BC0C0' },
    { id: '5', name: 'Kaurapuuro', amount: 200, calories: 150, date: '2024-11-05', color: '#9966FF' },
    { id: '6', name: 'Kinkkupiirakka', amount: 150, calories: 300, date: '2024-11-06', color: '#FF9F40' },
    { id: '7', name: 'Kanapasta', amount: 250, calories: 400, date: '2024-11-07', color: 'green' },
    { id: '8', name: 'REISSUMIES', amount: 250, calories: 400, date: '2024-11-08', color: 'aqua' },
    { id: '9', name: 'PIHVI', amount: 250, calories: 400, date: '2024-11-09', color: '#124123' },
  ]);
 

  const [averageCalories, setAverageCalories] = useState(0);

  useEffect(() => {
    if (foodHistory.length > 0) {
      const totalCalories = foodHistory.reduce((sum, item) => sum + item.calories, 0);
      setAverageCalories(totalCalories / foodHistory.length);
    }
  }, [foodHistory]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruokapäiväkirja</Text>
      <Text style={styles.subtitle}>Ruokailuiden Historia</Text>
      <FlatList
        data={foodHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.date}: {item.name}, {item.amount}g, {item.calories} kcal</Text>
          </View>
        )}
      />
      <Text style={styles.averageText}>
        Keskimääräisen ateriaisi kalorit: {averageCalories.toFixed(2)} kcal
      </Text>
      <Text style={styles.pieTitle}>ViikonAterioiden Kalorit</Text>
      <PieChart data={foodHistory} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: '600',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  averageText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  pieTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
