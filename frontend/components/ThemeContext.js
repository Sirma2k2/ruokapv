import React, { createContext, useState, useContext } from 'react';
import { StyleSheet } from 'react-native';

// Tämän tarkoitus on tarjota teema kaikille sovelluksen komponenteille ja vaihtaa teemaa light/dark mode välillä


const ThemeContext = createContext(); // Create context for theme

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);
    const toggleTheme = () => setDarkMode((prevMode) => !prevMode); // Toggle theme
    const theme = darkMode ? darkStyles : lightStyles; // choose theme based on darkMode

    return (
        <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


export const useTheme = () => useContext(ThemeContext); // Custom hook to access the theme from any component if imported


const lightStyles = StyleSheet.create({// Light theme styles

    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
    text: { color: 'black' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' },
    modalContainer: { backgroundColor: 'white', padding: 20, marginHorizontal: 40, borderRadius: 8 },
    buttonText: { color: 'black' },
    title: { fontSize: 24, textAlign: 'center', margin: 10, fontWeight: 'bold' },
    subtitle: { fontSize: 20, marginVertical: 10, fontWeight: '600' },
});

const darkStyles = StyleSheet.create({// Dark theme styles

    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' },
    text: { color: 'white' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center' },
    modalContainer: { backgroundColor: '#444', padding: 20, marginHorizontal: 40, borderRadius: 8 },
    buttonText: { color: 'white' },
    title: { fontSize: 24, textAlign: 'center', margin: 10, fontWeight: 'bold' },
    subtitle: { fontSize: 20, marginVertical: 10, fontWeight: '600' },
});

