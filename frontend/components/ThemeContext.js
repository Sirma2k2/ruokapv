import React, { createContext, useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('themePreference');
                if (savedTheme !== null) {
                    setDarkMode(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme preference', error);
            }
        };

        loadThemePreference();
    }, []);

    const toggleTheme = async () => {
        try {
            const newTheme = !darkMode ? 'dark' : 'light';
            await AsyncStorage.setItem('themePreference', newTheme);
            setDarkMode((prevMode) => !prevMode);
        } catch (error) {
            console.error('Failed to save theme preference', error);
        }
    };

    const theme = darkMode ? darkStyles : lightStyles;

    return (
        <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

const lightStyles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
    text: { color: 'black' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' },
    modalContainer: { backgroundColor: 'white', padding: 20, marginHorizontal: 40, borderRadius: 8 },
    buttonText: { color: 'black' },
    title: { fontSize: 24, textAlign: 'center', margin: 10, fontWeight: 'bold' },
    subtitle: { fontSize: 20, marginVertical: 10, fontWeight: '600' },
});

const darkStyles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' },
    text: { color: 'white' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center' },
    modalContainer: { backgroundColor: '#444', padding: 20, marginHorizontal: 40, borderRadius: 8 },
    buttonText: { color: 'white' },
    title: { fontSize: 24, textAlign: 'center', margin: 10, fontWeight: 'bold' },
    subtitle: { fontSize: 20, marginVertical: 10, fontWeight: '600' },
});
