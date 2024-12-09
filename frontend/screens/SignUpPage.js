import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';  // Import the new picker library
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import useAuth from '../hooks/useAuth'; 
import * as Updates from 'expo-updates';

import ServerIp from '../hooks/Global';

const SignUpPage = () => {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();  // Get the login function from useAuth
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    pword: '',
    cpword: '',
    age: '20',  // Default age set to 20
    weight: '60',  // Default weight set to 60
    height: '170',  // Default height set to 170 cm
    activityLevel: '',
    dietType: '',
    goal: '',
    gender: '',  // Default gender set to 'male'
  });

  useEffect(() => {
  }, [isLoggedIn, navigation]);

  const handleInputChange = (name) => (value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const setLogged = async () => {
    try {
      // Store user data and login status in SecureStore
      await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      await SecureStore.setItemAsync('isLoggedIn', 'true');
      console.log("User logged in:", userData);
      alert('Signed up successfully!');
      await new Promise(resolve => setTimeout(resolve, 800)); // delay for 0.8 seconds so the user can see the alert
      Updates.reloadAsync(); // Reload the app after successful login
     // setIsLoggedInState(true); // Update local state after successful login
    } catch (error) {
      console.error("Error storing user data:", error);
      alert('An error occurred while signing up. Please try again.');
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (userData.pword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return false;
    }
    if (userData.pword !== userData.cpword) {
      alert('Passwords do not match.');
      return false;
    }
    if (!/[a-zA-Z]/.test(userData.pword) || !/[0-9]/.test(userData.pword)) {
      alert('Password must contain at least one letter and one number.');
      return false;
    }
    if (!userData.pword) {
      alert('Please enter a password.');
      return false;
    }
    if (!userData.name) {
      alert('Please enter your name.');
      return false;
    }
    if (!userData.age) {
      alert('Please select your age.');
      return false;
    }
    if (!userData.weight) {
      alert('Please select your weight.');
      return false;
    }
    if (!userData.height) {
      alert('Please select your height.');
      return false;
    }
    if (!userData.activityLevel) {
      alert('Please select an activity level.');
      return false;
    }
    if (!userData.dietType) {
      alert('Please select a diet type.');
      return false;
    }
    if (!userData.goal) {
      alert('Please select a goal.');
      return false;
    }
    if (!userData.gender) { // Add gender validation
      alert('Please select your gender.');
      return false;
    }
    return true;
  };

  const handleSubmit = async() => { // BACKEND LOGIIKKA TÄHÄN POHJA ON JO VALMIINA!!!! //MISSÄ HITOSSA!?!?!? toi on nyt kahesti sama pätkä tossa ku en saa nätimmin toimii-paulus
    if (!validateForm()) return; // Validate the form before submitting

    try {
      const response = await fetch(ServerIp + '/add-user', {
        method: 'POST', 
        headers: { 
          'content-type': 'application/json',
        }, 
        body: JSON.stringify({
          knimi: userData.name,
          email: userData.email,
          pword: userData.pword,
          ika: userData.age, 
          paino: userData.weight,
          pituus: userData.height,
          aktiviteetti: userData.activityLevel === 'low' ? 1: userData.activityLevel === 'medium' ? 2: 3,
          tyyppi: userData.dietType === 'balanced' ? 1 : userData.dietType === 'keto' ? 2 : 3, 
          tavoite: userData.goal === 'lose' ? 1 : userData.goal === 'maintain' ? 2 : 3,
          sukupuoli: userData.gender, // Add gender to the request body
        }),
      });
      if (response.status === 201) {
        console.log('Successfully added')
        alert('User added successfully');
        setLogged(); // Pass login function here
      } else {
        console.log('Failed: ', response.status, ' ', response.headers)
        alert('Failed to add user');
        return;
      }
    } catch(error) {
      console.error('Error:', error)
    }

  };

  // Values for the pickers
  const ageValues = Array.from({ length: 100 }, (_, i) => i + 10); // 10 to 100 years
  const weightValues = Array.from({ length: 200 }, (_, i) => i + 30); // 30kg to 230kg
  const heightValues = Array.from({ length: 150 }, (_, i) => i + 120); // 120cm to 270cm

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={userData.email}
          onChangeText={handleInputChange('email')}
          accessibilityLabel="Email input"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={userData.pword}
          onChangeText={handleInputChange('pword')}
          accessibilityLabel="Password input"
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={userData.cpword}
          onChangeText={handleInputChange('cpword')}
          accessibilityLabel="Password input"
          secureTextEntry={true}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={userData.name}
          onChangeText={handleInputChange('name')}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select age', }} // Default value
          value={userData.age}
          onValueChange={handleInputChange('age')}
          items={ageValues.map((age) => ({ label: `${age}`, value: `${age}` }))}
          style={pickerSelectStyles}
          
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select gender' }} // Default value
          value={userData.gender}
          onValueChange={handleInputChange('gender')}
          items={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
          style={pickerSelectStyles}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (kg)</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select weight'}} // Default value
          value={userData.weight}
          onValueChange={handleInputChange('weight')}
          items={weightValues.map((weight) => ({ label: `${weight}`, value: `${weight}` }))}
          style={pickerSelectStyles}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select height',}} // Default value
          value={userData.height}
          onValueChange={handleInputChange('height')}
          items={heightValues.map((height) => ({ label: `${height}`, value: `${height}` }))}
          style={pickerSelectStyles}
        />
      </View>

      <Text style={styles.label}>Activity Level</Text>
      <View style={styles.buttonGroup}>
        {['low', 'medium', 'high'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.choiceButton,
              userData.activityLevel === level && { backgroundColor: '#007bff' },
            ]}
            onPress={() => handleInputChange('activityLevel')(level)}
          >
            <Text style={styles.choiceButtonText}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Diet Type</Text>
      <View style={styles.buttonGroup}>
        {['balanced', 'keto', 'vegan'].map((diet) => (
          <TouchableOpacity
            key={diet}
            style={[
              styles.choiceButton,
              userData.dietType === diet && { backgroundColor: '#007bff' },
            ]}
            onPress={() => handleInputChange('dietType')(diet)}
          >
            <Text style={styles.choiceButtonText}>{diet.charAt(0).toUpperCase() + diet.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Goal</Text>
      <View style={styles.buttonGroup}>
        {['lose', 'maintain', 'gain'].map((goal) => (
          <TouchableOpacity
            key={goal}
            style={[
              styles.choiceButton,
              userData.goal === goal && { backgroundColor: '#007bff' },
            ]}
            onPress={() => handleInputChange('goal')(goal)}
          >
            <Text style={styles.choiceButtonText}>{goal.charAt(0).toUpperCase() + goal.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'red',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#333',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  inputGroup: { marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderColor: '#ddd', borderWidth: 1 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  choiceButton: { padding: 15, margin: 5, backgroundColor: '#eee', borderRadius: 8 },
  choiceButtonText: { textAlign: 'center', color: '#333' },
  submitButton: { backgroundColor: '#007bff', padding: 20, borderRadius: 8, marginBottom: 20 },
  submitButtonText: { textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SignUpPage;