import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyScreen from '../screens/MyScreen';  
import NotesScreen from '../screens/NotesScreen'; 




const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      {/* Profile Screen */}
      <Stack.Screen name="MyScreen" component={MyScreen}
       options={{ headerShown: false }} />

      {/* Notes Screen */}
      <Stack.Screen name="NotesScreen" component={NotesScreen}
      options={{ title: 'My notes' }} />
    
   
    </Stack.Navigator>
  )
}

export default MyStack;
