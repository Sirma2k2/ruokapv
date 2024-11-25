import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpPage';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ onLogin }) => { // Make sure onLogin is passed to AppNavigator
    return (
        <Stack.Navigator initialRouteName="Welcome">
            {/* Use a render function to pass props and onLogin */}
            <Stack.Screen name="Welcome">
                {props => <WelcomeScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
