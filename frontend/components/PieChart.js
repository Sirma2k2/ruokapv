import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PieChart = ({ data }) => {
  // Get the last 5 meals
  const lastFiveMeals = data.slice(-5);
  const totalCalories = lastFiveMeals.reduce((sum, item) => sum + item.calories, 0);
  const pieSections = lastFiveMeals.map(item => ({
    ...item,
    percentage: (item.calories / totalCalories) * 100,
  }));

  return (
    <ScrollView horizontal pagingEnabled style={styles.scrollContainer}>
      {/* Loop over pieSections and display each section */}
      {pieSections.map((section, index) => (
        <View key={index} style={styles.page}>
          {/* Pie Chart Section */}
          <View style={[styles.pieChartContainer]}>
            <View style={[styles.pieSection, { flex: section.percentage }]}>
              <Text style={styles.pieText}>{section.name}</Text>
            </View>
          </View>

          {/* Meal Info Section */}
          <View style={styles.textContainer}>
            <Text style={styles.mealText}>{section.name}: {section.calories} kcal</Text>
            <Text style={styles.mealText}>Percentage: {section.percentage.toFixed(2)}%</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexDirection: 'row' },
  page: { width: 300, justifyContent: 'center', alignItems: 'center', padding: 10 },
  pieChartContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 150, height: 150, borderWidth: 1, borderColor: '#ccc', borderRadius: 75, overflow: 'hidden', position: 'relative' },
  pieSection: { height: '100%', justifyContent: 'center', alignItems: 'center' },
  pieText: { position: 'absolute', color: 'light blue', textAlign: 'center', width: '100%', fontWeight: 'bold' },
  textContainer: { marginTop: 10, alignItems: 'center' },
  mealText: { fontSize: 12, marginBottom: 5, color: 'blue' },
});

export default PieChart;
