import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



const PieChart = ({ data }) => { // data is just defined here, it does not come externally, rather it is just here and redefined in its component
  const totalCalories = data.reduce((sum, item) => sum + item.calories, 0);
  const pieSections = data.map(item => ({
    ...item,
    percentage: (item.calories / totalCalories) * 100,
  }));

  return (
    <View style={styles.pieChartContainer}>
      {pieSections.map((section, index) => (
        <View key={index} style={[styles.pieSection, { backgroundColor: section.color, flex: section.percentage }]}>
          <Text style={styles.pieText}>{section.name}: {section.calories} kcal</Text>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
    pieChartContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
    },
    pieSection: {
        height: '100%',
        justifyContent: 'center',
    },
    pieText: {
        position: 'absolute',
        color: 'white',
        textAlign: 'center',
        width: '100%',
    },
});

export default PieChart;
