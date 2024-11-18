import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext'; // Import the useTheme hook

const FoodScreen = ({ navigation }) => {


  const { theme } = useTheme(); // Access the theme from context

  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      <Text style={[styles.header, { color: theme.text.color }]}>Select Meal Type</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
        onPress={() => navigation.navigate('Breakfast')}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Breakfast</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
        onPress={() => navigation.navigate('Lunch')}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Lunch</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
        onPress={() => navigation.navigate('Dinner')}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Dinner</Text>
      </TouchableOpacity>
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
    marginVertical: 10,
    borderWidth: 2, 
    borderColor: 'blue', 
  },
  buttonText: {
    fontSize: 18,    
  }
});

export default FoodScreen;
