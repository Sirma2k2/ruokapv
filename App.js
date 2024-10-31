import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodScreen from './frontend/screens/foodScreen';
import TapBar from './frontend/components/TapBar';



const Stack = createNativeStackNavigator();


const Navigation = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={FoodScreen} />
    
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default function App() {
  return (
    <>
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
