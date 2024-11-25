import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store'; // For secure storage on mobile

// useAuth hook for checking if the user is logged in
const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            console.log('Checking authentication status...');

            // Check if SecureStore is available for mobile platforms
           
            //setIsLoggedIn(true); // Jos tämä rivi on pääällä pääsee ohittamaan kirjautumisen vaikka webin takia
           

            const storedLoginStatus = await SecureStore.getItemAsync('isLoggedIn');
            const storedFirstLaunch = await SecureStore.getItemAsync('isFirstLaunch');

            setIsLoggedIn(storedLoginStatus === 'true');
            setIsFirstLaunch(storedFirstLaunch === null);

            if (storedFirstLaunch === null) {
                await SecureStore.setItemAsync('isFirstLaunch', 'false');
            }

            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async () => {
        // For both mobile and web, use SecureStore (if available)
        await SecureStore.setItemAsync('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    const logout = async () => {
        // For both mobile and web, use SecureStore (if available)
        await SecureStore.setItemAsync('isLoggedIn', 'false');
        setIsLoggedIn(false);
    };

    // Function to completely clear credentials (for both web and mobile)
    const clearCredentials = async () => {
        console.log('Clearing credentials...');
        try {
            // For mobile, use SecureStore
            await SecureStore.deleteItemAsync('isLoggedIn');
            await SecureStore.deleteItemAsync('isFirstLaunch');

            // For web, use localStorage
            if (typeof localStorage !== 'undefined') {
                console.log('Clearing credentials from localStorage on web');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('isFirstLaunch');
            }

            console.log('Credentials cleared');
        } catch (error) {
            console.error('Error clearing credentials:', error);
        }
    };

    return { isLoggedIn, isFirstLaunch, login, logout, loading, clearCredentials };
};

export default useAuth;
