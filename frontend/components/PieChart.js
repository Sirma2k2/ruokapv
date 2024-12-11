import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const PieChart = ({ data }) => {
  // Get the last 10 meals and reverse the order
  const lastTenMeals = data.slice(-10).reverse();
  const totalCalories = lastTenMeals.reduce((sum, item) => sum + item.calories, 0);
  const pieSections = lastTenMeals.map(item => ({
    ...item,
    percentage: (item.calories / totalCalories) * 100,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Last 10 Foods</Text>
      <FlatList
        horizontal
        data={pieSections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.page}>
            {/* Pie Chart Section */}
            <View style={styles.pieChartContainer}>
              <View style={[styles.pieSection, { flex: item.percentage }]}>
                <Image source={{ uri: item.picture }} style={styles.pieImage} />
              </View>
            </View>

            {/* Meal Info Section */}
            <View style={styles.textContainer}>
              <Text style={styles.mealText}>{item.name}: {item.calories} kcal</Text>
              <Text style={styles.mealText}>Percentage: {item.percentage.toFixed(2)}%</Text>
            </View>
          </View>
        )}
        showsHorizontalScrollIndicator={true}
      />
      <Text style={styles.scrollHint}>Swipe to see more meals</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'blue' },
  page: { width: 300, justifyContent: 'center', alignItems: 'center', padding: 10 },
  pieChartContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 150, height: 150, borderWidth: 1, borderColor: '#ccc', borderRadius: 75, overflow: 'hidden', position: 'relative' },
  pieSection: { height: '100%', justifyContent: 'center', alignItems: 'center' },
  pieImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  textContainer: { marginTop: 10, alignItems: 'center' },
  mealText: { fontSize: 14, marginBottom: 5, color: 'blue' },
  scrollHint: { marginTop: 10, fontSize: 12, color: 'gray' },
});

export default PieChart;