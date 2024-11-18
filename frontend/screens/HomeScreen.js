import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import PieChart from '../components/PieChart'; // piechart.js josta tulee data
import { useTheme } from '../components/ThemeContext'; 

const HomeScreen = () => {
  const [foodHistory, setFoodHistory] = useState([]) // hardcoded 
  const [averageCalories, setAverageCalories] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0)
  const { theme } = useTheme();  // Access the theme from context

  useEffect(() => {
    const fetchFoodHistory = async () => {
    try {
      const response = await fetch ('http://localhost:3000/get-food')

    if (response.ok){
      const data = await response.json()
      
      const transformedData = data.map(item => ({
        id: item.id || Math.random().toString(), // Generoi id, jos sitä ei ole
        name: item.ruokanimi,
        amount: item.maarag,
        calories: item.kalorit
      }));
      setFoodHistory(transformedData);
    } else {
      console.error('Failed to fetch food history')
    } 
  }catch (error) {
    console.error('Error fetching data', error)
  }   
  }
  fetchFoodHistory();
}, []);

 

  useEffect(() => {
    if (foodHistory.length > 0) {
      const totalCalories = foodHistory.reduce((sum, item) => sum + item.calories, 0);
      setAverageCalories(totalCalories / foodHistory.length);
      setTotalCalories(totalCalories)
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
      <Text style={[styles.totalText, { color: theme.text.color}]}>
        Total calories consumed: {totalCalories.toFixed(2)} calories {}
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
  totalText: { marginTop: 10, fontSize: 18, fontWeight: 'bold'},
  pieTitle: { marginTop: 20, fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
});

export default HomeScreen;
