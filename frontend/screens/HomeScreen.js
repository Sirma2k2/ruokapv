import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import PieChart from '../components/PieChart'; // piechart.js josta tulee data
import { useTheme } from '../components/ThemeContext'; 

const HomeScreen = () => {
  const [foodHistory, setFoodHistory] = useState([ // hardcoded 
    { id: '1', name: 'Apple', amount: 150, calories: 80, date: '2024-11-01', color: '#FF6384' },
    { id: '2', name: 'Chicken Breast', amount: 200, calories: 350, date: '2024-11-02', color: '#36A2EB' },
    { id: '3', name: 'Rice', amount: 180, calories: 220, date: '2024-11-03', color: '#FFCE56' },
    { id: '4', name: 'Salad', amount: 100, calories: 50, date: '2024-11-04', color: '#4BC0C0' },
    { id: '5', name: 'Oatmeal', amount: 200, calories: 150, date: '2024-11-05', color: '#9966FF' },
    { id: '6', name: 'Ham Pie', amount: 150, calories: 300, date: '2024-11-06', color: '#FF9F40' },
    { id: '7', name: 'Chicken Pasta', amount: 250, calories: 400, date: '2024-11-07', color: 'green' },
    { id: '8', name: 'Rye Bread', amount: 250, calories: 400, date: '2024-11-08', color: 'aqua' },
    { id: '9', name: 'Steak', amount: 250, calories: 400, date: '2024-11-09', color: '#124123' },
  ]);

  const [averageCalories, setAverageCalories] = useState(0);
  const { theme } = useTheme();  // Access the theme from context

  useEffect(() => {
    if (foodHistory.length > 0) {
      const totalCalories = foodHistory.reduce((sum, item) => sum + item.calories, 0);
      setAverageCalories(totalCalories / foodHistory.length);
    }
  }, [foodHistory]);

  return (
    <ScrollView>
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      <Text style={[styles.subtitle, { color: theme.text.color }]}>Meal diary</Text>
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
      <Text style={[styles.pieTitle, { color: theme.text.color }]}>Your last five meals</Text>
      <PieChart data={foodHistory} />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, margin: 1 },
  title: { fontSize: 24, textAlign: 'center',  margin: 10, fontWeight: 'bold' },
  subtitle: { fontSize: 20, marginVertical: 10, fontWeight: '600' },
  item: { padding: 10, borderBottomWidth: 1 },
  averageText: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  pieTitle: { marginTop: 20, fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
});

export default HomeScreen;
