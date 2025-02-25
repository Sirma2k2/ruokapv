import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpPage';
import HomeScreen from '../screens/HomeScreen';
import TapBar from '../components/TapBar';
const Stack = createStackNavigator();

const AppNavigator = ({ onLogin }) => { // Make sure onLogin is passed to AppNavigator
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name="Welcome">
                {props => <WelcomeScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={TapBar} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
