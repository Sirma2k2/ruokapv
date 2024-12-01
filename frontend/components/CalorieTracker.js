import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
const CalorieTracker = () => {
    const [totalCalories, setTotalCalories] = useState(); // Example total calories per day
    const [consumedCalories, setConsumedCalories] = useState();

    const handleAddCalories = (calories) => {
        setConsumedCalories(consumedCalories + calories);
    };

    const caloriesLeft = totalCalories - consumedCalories;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Calorie Tracker</Text>
            <Text style={styles.totalCalories}>Total Calories: {totalCalories}</Text>
            <Text style={styles.consumedCalories}>Consumed Calories: {consumedCalories}</Text>
            <Text style={styles.caloriesLeft}>Calories Left: {caloriesLeft}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    totalCalories: {
        fontSize: 18,
        marginTop: 20,
    },
    consumedCalories: {
        fontSize: 18,
        marginTop: 10,
    },
    caloriesLeft: {
        fontSize: 18,
        marginTop: 10,
    },l
   
});

export default CalorieTracker;