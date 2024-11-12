import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FoodScreen = () => {
  
  const [currentScreen, setCurrentScreen] = useState('menu')

  const selectMealType = (mealType) => {
    setCurrentScreen(mealType);
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'menu' ? (
        <>
          <Text style={styles.header}>Select Meal Type</Text>
          
          {/* Replace Button with TouchableOpacity */}
          <TouchableOpacity style={styles.button} onPress={() => selectMealType('Breakfast')}>
            <Text style={styles.buttonText}>Breakfast</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => selectMealType('Lunch')}>
            <Text style={styles.buttonText}>Lunch</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => selectMealType('Dinner')}>
            <Text style={styles.buttonText}>Dinner</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.header}>Add {currentScreen} Entry</Text>
          
          {/* Back to Menu Button */}
          <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('menu')}>
            <Text style={styles.buttonText}>Back to Menu</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

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
    elevation: 3,
    backgroundColor: 'black',
    marginVertical: 10, 
  },
  buttonText: {
    color: 'white',  
    fontSize: 18,    
  }
})

export default FoodScreen;
