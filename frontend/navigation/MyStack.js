import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyScreen from '../screens/MyScreen';  
import NotesScreen from '../screens/NotesScreen'; 
import BreakfastScreen from '../screens/BreakfastScreen'
import DinnerScreen from '../screens/DinnerScreen' 
import LunchScreen from '../screens/LunchScreen'



const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      {/* Profile Screen (MyScreen) */}
      <Stack.Screen name="MyScreen" component={MyScreen}
       options={{ headerShown: false }} />

      {/* Notes Screen */}
      <Stack.Screen name="NotesScreen" component={NotesScreen}
      options={{ title: 'My notes' }} />
      
      <Stack.Screen 
        name="Breakfast" component={BreakfastScreen}
        options={{ title: 'Build Your Breakfast' }}
      />

      <Stack.Screen 
        name="Lunch" 
        component={LunchScreen}
        options={{ title: 'Build Your Lunch' }}
      />
      <Stack.Screen 
        name="Dinner" 
        component={DinnerScreen}
        options={{ title: 'Build Your Dinner' }}
      />

   
    </Stack.Navigator>
  )
}

export default MyStack;
