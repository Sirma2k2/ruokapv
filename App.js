import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // not needed since we are using TapBar as navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // not needed since we are using TapBar as navigation
import FoodScreen from './frontend/screens/foodScreen';// not needed since we are using TapBar as navigation
import TapBar from './frontend/components/TapBar';
import TaskBar from './frontend/components/taskBar';
import { Platform } from 'react-native';
import HomeScreen from './frontend/screens/HomeScreen'; // not needed since we are using TapBar as navigation
import { ThemeProvider } from './frontend/components/ThemeContext';




export default function App() {
  return (
    <ThemeProvider>


      {Platform.OS === 'android' && <TaskBar />}
     <TapBar />
    </ThemeProvider>

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
