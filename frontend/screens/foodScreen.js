import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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