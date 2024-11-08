import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyScreen from '../screens/MyScreen';  
import NotesScreen from '../screens/NotesScreen';  

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      {/* Profile Screen (MyScreen) */}
      <Stack.Screen name="MyScreen" component={MyScreen} options={{ title: 'Profile' }} />
      {/* Notes Screen */}
      <Stack.Screen name="NotesScreen" component={NotesScreen} />
    </Stack.Navigator>
  );
};

export default MyStack;
