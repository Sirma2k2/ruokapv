import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodScreen from './frontend/screens/foodScreen';

import TapBar from './frontend/components/TapBar';


import TaskBar from './frontend/components/taskBar';
import { Platform } from 'react-native';


const Stack = createNativeStackNavigator();


const Navigation = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="FoodScreen" component={FoodScreen} />

    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default function App() {
  return (
    <>


      {Platform.OS === 'android' && <TaskBar />}
      <Navigation />
     <TapBar />
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
