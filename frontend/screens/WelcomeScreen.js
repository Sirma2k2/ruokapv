import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { useTheme } from '../components/ThemeContext'; 


const WelcomeScreen = ({ onLogin }) => {

    
    const [isLogin, setIsLogin] = useState(true); // this is a local state for form switching
    const [email, setEmail] = useState(''); // to store the email input to the backend
    const [password, setPassword] = useState(''); // to store the password input to the backend
    const [errorMessage, setErrorMessage] = useState(''); // to store error messages

    const [useHardcodedLogin, setUseHardcodedLogin] = useState(true); // this is for testing purposes and will be removed in production

    useEffect(() => { // when this page is loaded, check if user is already logged in
        // Check if user is already logged in when the component mounts
        const checkLoginStatus = async () => {
            const user = await SecureStore.getItemAsync('user');
            if (user) {
                console.log("User is already logged in");
                // If a user is stored, call onLogin to notify parent (App) which will navigate to the home screen
                onLogin(); // this will navigate to the home screen
            } else {
                console.log("User is not logged in");
            }
        };
        checkLoginStatus();
    }, [onLogin]);

    const handleAuth = async () => {

        if (useHardcodedLogin && await handleHardcodedLogin()) return; // this is for testing purposes and will be removed in production

        if (!email || !password) { // if email or password is empty, set error message
            setErrorMessage('Email and password are required');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) { // some basic email validation to check if it's in email format
            setErrorMessage('Invalid email format');
            return;
        }

        const url = `http://your-backend-url/${isLogin ? 'login' : 'signup'}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {  await SecureStore.setItemAsync('user', JSON.stringify(data.user));
              onLogin(); // AINUT RIVI MITÄ TEIDÄN TARVITSEE OIKEESTAAN TIETÄÄ, KUTSU TÄTÄ FUNKTIOA KUN KIRJAUTUMINEN ONNISTUU
            } else {setErrorMessage(data.message || `${isLogin ? 'Login' : 'Signup'} failed`);}
        } catch (error) {setErrorMessage('An error occurred. Please try again.');}
    };


    const handleHardcodedLogin = async () => { // this is for testing purposes and will be removed in production
        const hardcodedCredentials = { email: "test@example.com", password: "1234" };
        if (!email || !password) {
            setErrorMessage('Email and password are required');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setErrorMessage('Invalid email format');
            return false;
        }
        if (email === hardcodedCredentials.email && password === hardcodedCredentials.password) {
            console.log("Hardcoded login successful!");
            await SecureStore.setItemAsync('user', JSON.stringify({ email }));
            onLogin();
            return true;
        } else {
            setErrorMessage('Invalid email or password for hardcoded login');
            return false;
        }
    }; // end of handleHardcodedLogin which is for testing purposes and will be removed in production
    


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
           {/* Login */}
            <TouchableOpacity style={styles.login} onPress={handleAuth}>
                <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            </TouchableOpacity>
            {/* Signup */}
            <TouchableOpacity style={styles.signup} onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.buttonText}>{isLogin ? 'Switch to Sign Up' : 'Switch to Login'}</Text>
            </TouchableOpacity>
        </View>
    );


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    login: {
        width: '80%',
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: '#007bff',
        alignItems: 'center',
        marginBottom: 10,
    },
    signup: {
        width: '80%',
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: '#28a745',
        alignItems: 'center',
    },
    buttonText: {
        color: '#123',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default WelcomeScreen;
