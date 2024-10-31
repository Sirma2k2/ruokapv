import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodScreen from './frontend/screens/foodScreen';
import TapBar from './frontend/components/TapBar';
import TaskBar from './frontend/components/taskBar';
import { Platform } from 'react-native';
import HomeScreen from './frontend/screens/HomeScreen';




export default function App() {
  return (
    <>


      {Platform.OS === 'android' && <TaskBar />}
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
