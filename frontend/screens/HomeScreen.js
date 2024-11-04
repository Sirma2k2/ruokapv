import React, { Component, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const [foodHistory, setFoodHistory] = useState([ //hardcoded data toistaiseksi
    { id: '1', name: 'Omena', amount: 150, calories: 80, date: '2024-11-01' },
    { id: '2', name: 'Kananrinta', amount: 200, calories: 350, date: '2024-11-02' },
    { id: '3', name: 'Riisi', amount: 180, calories: 220, date: '2024-11-03' },
    { id: '4', name: 'Salaatti', amount: 100, calories: 50, date: '2024-11-04' },
  ]);

  const [averageCalories, setAverageCalories] = useState(0);

  useEffect(() => {  //lasketaan keskiarvoiset kalorit viikon ajalta
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
        Viikon keskiarvoiset kalorit: {averageCalories.toFixed(2)} kcal
      </Text>
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
});


export default HomeScreen;
