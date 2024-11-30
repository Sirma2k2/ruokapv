// FoodDiaryStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodScreen from '../screens/foodScreen'; 
import BreakfastScreen from '../screens/BreakfastScreen'; 
import LunchScreen from '../screens/LunchScreen';
import DinnerScreen from '../screens/DinnerScreen';
import MealsScreen from '../screens/MealsScreen';

const Stack = createNativeStackNavigator();

const FoodStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FoodDiary" component={FoodScreen} options={{ headerShown: false }}  />
      <Stack.Screen name="Breakfast" component={BreakfastScreen} />
      <Stack.Screen name="Meals" component={MealsScreen} />
      <Stack.Screen name="Lunch" component={LunchScreen} />
      <Stack.Screen name="Dinner" component={DinnerScreen} />
    </Stack.Navigator>
  );
};

export default FoodStack;
