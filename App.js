import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './frontend/components/ThemeContext'; // Assuming theme is used
import useAuth from './frontend/hooks/useAuth'; // Assuming useAuth handles authentication
import TapBar from './frontend/components/TapBar';
import TaskBar from './frontend/components/taskBar';
import AppNavigator from './frontend/navigation/AppNavigator'; // Import AppNavigator

export default function App() {
    const { isLoggedIn, login } = useAuth();

    return (
        <ThemeProvider>
            <NavigationContainer>
                {isLoggedIn ? (
                    <>
                        {Platform.OS === 'android' && <TaskBar />}
                        <TapBar />
                    </>
                ) : (
                    <AppNavigator onLogin={login} />
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
