
import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

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
          <Button title="Breakfast" onPress={() => selectMealType('Breakfast')} />
          <Button title="Lunch" onPress={() => selectMealType('Lunch')} />
          <Button title="Dinner" onPress={() => selectMealType('Dinner')} />
        </>
      ) : (
        <>
          <Text style={styles.header}>Add {currentScreen} Entry</Text>
          <Button title="Back to Menu" onPress={() => setCurrentScreen('menu')} />
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
})

export default FoodScreen;
