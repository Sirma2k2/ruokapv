import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

import ServerIp from '../hooks/Global';

const WelcomeScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation(); // Initialize navigation

    useEffect(() => {
        // Check if the user is already logged in
        const checkLoginStatus = async () => {
            const user = await SecureStore.getItemAsync('user');
            if (user) {
                console.log("User is already logged in");
                onLogin(); // Notify parent (App) to navigate to home screen
            } else {
                console.log("User is not logged in");
            }
        };
        checkLoginStatus();
    }, [onLogin]);

    const handleLogin = async () => { // BACKEND LOGIIIKKA TÄHÄN, HARDCODE CREDIDENTIALS VOI LAITTAA KOMMENTTIIN KUN TOIMII !!! //MY BAD POISTINE! -Paulus
        // Handle login logic here (either hardcoded or API call)

        if (!email || !password) {
            console.log('Email and password are required');
            return;
        }

        try {
            console.log("yrittää kirjautua");
            const response = await fetch(ServerIp + '/login', {
              method: 'POST', 
              headers: { 
                'content-type': 'application/json',
              }, 
              body: JSON.stringify({
                email: email,
                pword: password,
              }),
            });

            const result = await response.json();

            if (response.status === 201) {
              console.log('logged in');
              console.log(JSON.stringify(result.data));
              await SecureStore.setItemAsync('userData', JSON.stringify(result.data));
              onLogin(); // Notify parent about successful login
            } else {
              console.log('Failed: ', response.status, ' ', response.headers);
              alert('error');
              return;
            }
          } catch(error) {
            console.error('Error:', error)
          }  

    };

    return (
        <View style={styles.container}>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <Text style={styles.title}>Login</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Sign Up button that navigates to SignUpScreen */}
            <TouchableOpacity 
                style={styles.switchButton} 
                onPress={() => navigation.navigate('SignUp')} 
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, marginBottom: 24, textAlign: 'center', fontWeight: 'bold', color: '#333' },
    input: { width: '80%', height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 16, backgroundColor: '#fff' },
    error: { color: 'red', marginBottom: 16, textAlign: 'center' },
    button: { width: '80%', paddingVertical: 15, borderRadius: 8, backgroundColor: '#007bff', alignItems: 'center', marginBottom: 10 },
    switchButton: { width: '80%', paddingVertical: 15, borderRadius: 8, backgroundColor: '#28a745', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default WelcomeScreen;
