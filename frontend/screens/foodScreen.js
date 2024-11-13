import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
<<<<<<< HEAD
import { useTheme } from '../components/ThemeContext';

const FoodScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      <Text style={[styles.header, { color: theme.text.color }]}>Select Meal Type</Text>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
        onPress={() => navigation.navigate('Breakfast')}  // Navigate to Breakfast screen
      >
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Breakfast</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
        onPress={() => navigation.navigate('Lunch')}  // Navigate to Lunch screen
      >
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Lunch</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
        onPress={() => navigation.navigate('Dinner')}  // Navigate to Dinner screen
      >
        <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Dinner</Text>
      </TouchableOpacity>
    </View>
  );
};
=======

const FoodScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.header}>Select Meal Type</Text>
    
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Breakfast')}>
      <Text style={styles.buttonText}>Breakfast</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Lunch')}>
      <Text style={styles.buttonText}>Lunch</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dinner')}>
      <Text style={styles.buttonText}>Dinner</Text>
    </TouchableOpacity>
  </View>
);
>>>>>>> e6df97a7fe11095dfd7f3d64ea031cf26f772d4c

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center' 
  },
  header: { 
    fontSize: 24, 
    marginTop: 40, 
    marginBottom: 20, 
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: 'black',
    marginVertical: 10, 
  },
  buttonText: {
    color: 'white',  
    fontSize: 18,    
  }
});

export default FoodScreen;