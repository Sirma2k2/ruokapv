//import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
//import { createNativeStackNavigator } from '@react-navigation/native-stack'; // not needed since we are using TapBar as navigation
//import FoodScreen from './frontend/screens/foodScreen';// not needed since we are using TapBar as navigation
import TapBar from './frontend/components/TapBar';
import TaskBar from './frontend/components/taskBar';
import { Platform } from 'react-native';
//import HomeScreen from './frontend/screens/HomeScreen'; // not needed since we are using TapBar as navigation
import { ThemeProvider, useTheme } from './frontend/components/ThemeContext'; // if dark mode is implemented
import useAuth from './frontend/hooks/useAuth'; // AUTHENTICATION
import WelcomeScreen from './frontend/screens/WelcomeScreen'; 


export default function App() {

const { isLoggedIn, isFirstLaunch, login } = useAuth();

  if (isLoggedIn === false /*|| isFirstLaunch === null*/) { // this will be false if
    // Show a loading screen or splash while checking auth status
    // Or return a loading screen component
    console.log('Loading...');
    return <WelcomeScreen onLogin={login} />;
} 

 
 
return (
  <ThemeProvider>
    <NavigationContainer>
      {isLoggedIn ? (
        <>
          {Platform.OS === 'android' && <TaskBar />}
          <TapBar />
        </>
      ) : (
        <WelcomeScreen onLogin={login} />
      )}
    </NavigationContainer>
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
