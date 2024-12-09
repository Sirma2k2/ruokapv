import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

import ServerIp from '../hooks/Global';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const WelcomeScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation(); // Initialize navigation
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Email and password are required');
            console.log('Email and password are required');
            return;
        }

        try {
            setLoading(true); // Start loading
            console.log("Attempting to log in with email:", email);
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
              alert('error', response.status);
              return;
            }
          } catch(error) {
            console.error('Error:', error)
            alert('Error:', error);
          } finally {
            setLoading(false); // Stop loading
          }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <>
                    <Text style={styles.mainHeader}>Fitnessbuddy</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons name="fitness" size={100} color="#007bff" />
                    </View>
                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                    <View style={styles.iconContainer}>
                        <Ionicons name="person-circle-outline" size={50} color="#007bff" />
                    </View>
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
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f5f5f5', marginTop: -20 },
    title: { fontSize: 23, marginBottom: 24, textAlign: 'center', fontWeight: 'bold', color: '#333' },
    input: { width: '80%', height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 16, backgroundColor: '#fff' },
    error: { color: 'red', marginBottom: 16, textAlign: 'center' },
    button: { width: '80%', paddingVertical: 15, borderRadius: 8, backgroundColor: '#007bff', alignItems: 'center', marginBottom: 10 },
    switchButton: { width: '80%', paddingVertical: 15, borderRadius: 8, backgroundColor: '#28a745', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    mainHeader: { fontSize: 40, marginBottom: 20, textAlign: 'center', fontWeight: 'bold', color: '#333' },
    iconContainer: { alignItems: 'center', padding: 10 },
});

export default WelcomeScreen;