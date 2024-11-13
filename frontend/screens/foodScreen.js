import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext'; // Import the useTheme hook to access the theme

const FoodScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const { theme } = useTheme(); // Get the theme from the context

  const selectMealType = (mealType) => {
    setCurrentScreen(mealType);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      {currentScreen === 'menu' ? (
        <>
          <Text style={[styles.header, { color: theme.text.color }]}>Select Meal Type</Text>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
            onPress={() => selectMealType('Breakfast')}
          >
            <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Breakfast</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
            onPress={() => selectMealType('Lunch')}
          >
            <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Lunch</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
            onPress={() => selectMealType('Dinner')}
          >
            <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Dinner</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.header, { color: theme.text.color }]}>Add {currentScreen} Entry</Text>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
            onPress={() => setCurrentScreen('menu')}
          >
            <Text style={[styles.buttonText, { color: theme.buttonTextColor }]}>Back to Menu</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

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
    fontWeight: 'bold' 
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginVertical: 10, 
  },
  buttonText: {
    fontSize: 18,    
  }
});

export default FoodScreen;
