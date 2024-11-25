import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../components/ThemeContext'; // Import the useTheme hook
import Ionicons from '@expo/vector-icons/Ionicons';

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
        <Ionicons name="sunny" size={24} color={theme.iconColor} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
        onPress={() => navigation.navigate('Lunch')}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Lunch</Text>
        <Ionicons name="restaurant" size={24} color={theme.iconColor} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
        onPress={() => navigation.navigate('Dinner')}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Dinner</Text>
        <Ionicons name="moon" size={24} color={theme.iconColor} style={styles.icon} />
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
    fontSize: 28, 
    marginTop: 40, 
    marginBottom: 30, 
    fontWeight: 'bold' 
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginVertical: 10,
    borderWidth: 2, 
    borderColor: 'blue',
  
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,     
  }, 
  icon: {
    marginRight: 10,
  }
});

export default FoodScreen;
