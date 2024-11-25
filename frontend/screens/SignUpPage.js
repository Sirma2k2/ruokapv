import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';  // Import the new picker library

const SignUpPage = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: '',
    age: '20',  // Default age set to 20
    weight: '60',  // Default weight set to 60
    height: '170',  // Default height set to 170 cm
    activityLevel: '',
    dietType: '',
    goal: ''
  });

  const handleInputChange = (name) => (value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => { // all backend logic will be added here

    const userDataForBackend = { // myscreenin mukainen data
        knimi: userData.name, // User's name
        ika: parseInt(userData.age), // Age: integer
        paino: parseInt(userData.weight), // Weight: integer
        pituus: parseInt(userData.height), // Height: integer
        aktiviteetti: userData.activityLevel === 'low' ? 1 : userData.activityLevel === 'medium' ? 2 : 3, // Activity Level: 1 for low, 2 for medium, 3 for high
        tyyppi: userData.dietType === 'balanced' ? 1 : userData.dietType === 'keto' ? 2 : 3, // Diet Type: 1 for balanced, 2 for keto, 3 for vegan
        tavoite: userData.goal === 'lose' ? 1 : userData.goal === 'maintain' ? 2 : 3 // Goal: 1 for lose, 2 for maintain, 3 for gain
      }; console.log('User Data:', userData);

    console.log('User Data:', userData);
    navigation.navigate('HomeScreen', { userData }); // tärkeä osa, navigoi eteenpäin ja vie datan mukanaan
  };

  // Values for the pickers
  const ageValues = Array.from({ length: 100 }, (_, i) => i + 10); // 10 to 100 years
  const weightValues = Array.from({ length: 200 }, (_, i) => i + 30); // 30kg to 230kg
  const heightValues = Array.from({ length: 150 }, (_, i) => i + 120); // 120cm to 270cm


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={userData.name}
          onChangeText={handleInputChange('name')}
        />
      </View>

      {/* Age Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select age', value: null }}
          value={userData.age}
          onValueChange={handleInputChange('age')}
          items={ageValues.map((age) => ({ label: `${age}`, value: `${age}` }))}
          style={pickerStyle}
        />
      </View>

      {/* Weight Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (kg)</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select weight', value: null }}
          value={userData.weight}
          onValueChange={handleInputChange('weight')}
          items={weightValues.map((weight) => ({ label: `${weight}`, value: `${weight}` }))}
          style={pickerStyle}
        />
      </View>

      {/* Height Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <RNPickerSelect
          placeholder={{ label: 'Select height', value: null }}
          value={userData.height}
          onValueChange={handleInputChange('height')}
          items={heightValues.map((height) => ({ label: `${height}`, value: `${height}` }))}
          style={pickerStyle}
        />
      </View>

      {/* Activity Level */}
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

      {/* Diet Type */}
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

      {/* Goal */}
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

const pickerStyle = {
    inputAndroid: {
      fontSize: 18,
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#ddd',
      backgroundColor: '#fff',
      marginBottom: 20,
    },
   inputIOS: {
      fontSize: 18,
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#ddd',
      backgroundColor: '#fff',
      marginBottom: 20,
    },
  };

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  inputGroup: { marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderColor: '#ddd', borderWidth: 1 },
  picker: { height: '50%',  width: '100%',   marginBottom: 20,},
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  choiceButton: { padding: 15, margin: 5, backgroundColor: '#eee', borderRadius: 8 },
  choiceButtonText: { textAlign: 'center', color: '#333' },
  submitButton: { backgroundColor: '#007bff', padding: 20, borderRadius: 8, marginBottom: 20 },
  submitButtonText: { textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SignUpPage;
