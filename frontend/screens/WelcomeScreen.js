import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { useTheme } from '../components/ThemeContext'; 


const WelcomeScreen = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Check if user is already logged in when the component mounts
        const checkLoginStatus = async () => {
            const user = await SecureStore.getItemAsync('user');
            if (user) {
                // If a user is stored, call onLogin to notify parent (App)
                onLogin();
            }
        };
        checkLoginStatus();
    }, [onLogin]);

    const handleAuth = async () => {
        if (isLogin) {
            // Simulate a simple login check (you can replace this with real logic)
            if (email === 'user@example.com' && password === 'password123') {
                await SecureStore.setItemAsync('user', JSON.stringify({ email }));
                onLogin(); // Notify parent of successful login
                console.log('Logging in with', email, password);
            } else {
                setErrorMessage('Invalid email or password.');
            }
        } else {
            // Simulate signup (this can be expanded to handle real signup logic)
            console.log('Signing up with', email, password);
            setErrorMessage('');
        }
    };

    return (
        <View style={styles.container}>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title={isLogin ? 'Login' : 'Sign Up'} onPress={handleAuth} />
            <Button
                title={isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                onPress={() => setIsLogin(!isLogin)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default WelcomeScreen;
