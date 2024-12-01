import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially, null to check if the user is being authenticated
    const [loading, setLoading] = useState(true); // Used to show a loading screen while checking the auth status

    // Check the auth status when the app is loaded
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const storedLoginStatus = await SecureStore.getItemAsync('isLoggedIn');
                // Set the login status based on what is stored in SecureStore
                setIsLoggedIn(storedLoginStatus === 'true'); 
            } catch (error) {
                console.error('Error reading login status', error);
                setIsLoggedIn(false); // Default to false if error occurs
            } finally {
                setLoading(false); // Once the check is complete, stop the loading
            }
        };  
        checkAuthStatus();
    }, []);

    const login = async () => {
        try {
            // When login is successful, store the login status in SecureStore and update the state
            await SecureStore.setItemAsync('isLoggedIn', 'true');
            setIsLoggedIn(true); // Update state to true after successful login
        } catch (error) {
            console.error('Error logging in', error);
        }
    };

    const logout = async () => {
        try {
            // Clear the login status and update state to false
            await SecureStore.setItemAsync('isLoggedIn', 'false');
            setIsLoggedIn(false); // Update state to false after logout
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    // Function to clear credentials from SecureStore
    const clearCredentials = async () => { // This is for logging out and testing purposes
        try {
            // Remove any sensitive user data from SecureStore
            await SecureStore.deleteItemAsync('userData');
            await SecureStore.deleteItemAsync('isLoggedIn');
            console.log('User credentials cleared');
        } catch (error) {
            console.error('Error clearing credentials', error);
        }
    }; // End of testing function for clearing credentials

    return {
        isLoggedIn,
        login,
        logout,
        clearCredentials,
        loading,
    };
};

export default useAuth;
