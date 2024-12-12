import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CalorieTracker = ({ goal, food, remaining }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Calories</Text>
      {/* Top Row: Goal - Food = Remaining */}
      <TouchableOpacity onPress={() => console.log('Expand/collapse pressed')} style={styles.row}>
        {/* Goal Section */}
        <View style={styles.column}>
          <Text style={styles.label}>Goal</Text>
          <Text style={styles.value}>{goal} kcal</Text>
        </View>
        <Text style={styles.operator}>+</Text>
        {/* Food Section */}
        <View style={styles.column}>
          <Text style={styles.label}>Food</Text>
          <Text style={styles.value}>{food} kcal</Text>
        </View>
        <Text style={styles.operator}>=</Text>

        {/* Remaining Section */}
        <View style={styles.column}>
          <Text style={styles.label}>Remaining</Text>
          <Text
            style={[
                styles.value,
                { color: remaining >= 0 ? 'green' : 'red' },
            ]}
            >
            {remaining >= 0 ? remaining : `-${Math.abs(remaining)}`} kcal
            </Text>

        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginVertical: 10,
        backgroundColor: '#fff5ee', // Universal color for both light and dark mode
        borderRadius: 15,
        borderColor: '#4169e1',
        borderWidth: 1, 
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Shadow on Android
        alignSelf: 'stretch', // Ensure the container spans its parent width
        marginHorizontal: 20,
        marginRight: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Even spacing between columns
        alignItems: 'center', // Align vertically
        width: '100%', // Ensure row spans container width
    },
    column: {
        flex: 1, // Ensure equal width for all columns
        alignItems: 'center', // Center content in each column
    },
    label: {
        fontSize: 14,
        color: '#4682b4', // Universal color for both light and dark mode
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000', // Universal color for both light and dark mode
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#4169e1',
      marginHorizontal: 10,
      flexShrink: 1, 
      alignItems: 'flex-end', 
      whiteSpace: 'nowrap', 
      overflow: 'hidden', 
      textAlign: 'center', 
  },
  
});

export default CalorieTracker;
