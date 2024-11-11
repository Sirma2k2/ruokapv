import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Modal, StyleSheet, TextInput, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../components/ThemeContext';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';


const MyScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    dietType: '',
    goal: ''
  });
  const [menuBarVisible, setMenuBarVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
    option5: false,
  });
  

  const { theme, toggleTheme } = useTheme();

  const handleCheckboxChange = (key) => (newValue) => {
    setCheckboxValues((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleInputChange = (name) => (value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('User Data:', userData);
  };


  return (
    <View style={[styles.container, theme.container]}>
      <TouchableOpacity style = {styles.Notes} onPress={() => {
        console.log("navigate to notes");
        navigation.navigate('NotesScreen');
      }}>
        <Text> My Notes</Text>
      </TouchableOpacity>
      <View style={styles.topRightContainer}></View>
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, theme.text]}>User Profile</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, theme.text]}>Name</Text>
          <TextInput
            style={[styles.input, theme.input]}
            placeholder="Enter your name"
            value={userData.name}
            onChangeText={handleInputChange('name')}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, theme.text]}>Age</Text>
          <TextInput
            style={[styles.input, theme.input]}
            keyboardType="numeric"
            placeholder="Enter your age"
            value={userData.age}
            onChangeText={handleInputChange('age')}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, theme.text]}>Weight (kg)</Text>
          <TextInput
            style={[styles.input, theme.input]}
            keyboardType="numeric"
            placeholder="Enter your weight"
            value={userData.weight}
            onChangeText={handleInputChange('weight')}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, theme.text]}>Height (cm)</Text>
          <TextInput
            style={[styles.input, theme.input]}
            keyboardType="numeric"
            placeholder="Enter your height"
            value={userData.height}
            onChangeText={handleInputChange('height')}
          />
        </View>

        <Text style={[styles.label, theme.text]}>Activity Level</Text>
        <View style={styles.buttonGroup}>
          {['low', 'medium', 'high'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.choiceButton,
                userData.activityLevel === level && styles.selectedButton,
              ]}
              onPress={() => handleInputChange('activityLevel')(level)}
            >
              <Text style={[styles.choiceButtonText, theme.text]}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, theme.text]}>Diet Type</Text>
        <View style={styles.buttonGroup}>
          {['balanced', 'keto', 'vegan'].map((diet) => (
            <TouchableOpacity
              key={diet}
              style={[
                styles.choiceButton,
                userData.dietType === diet && styles.selectedButton,
              ]}
              onPress={() => handleInputChange('dietType')(diet)}
            >
              <Text style={[styles.choiceButtonText, theme.text]}>{diet.charAt(0).toUpperCase() + diet.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, theme.text]}>Goal</Text>
        <View style={styles.buttonGroup}>
          {['lose', 'maintain', 'gain'].map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.choiceButton,
                userData.goal === goal && styles.selectedButton,
              ]}
              onPress={() => handleInputChange('goal')(goal)}
            >
              <Text style={[styles.choiceButtonText, theme.text]}>{goal.charAt(0).toUpperCase() + goal.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Change</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  formContainer: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  inputGroup: { marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderColor: '#ddd', borderWidth: 1 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  choiceButton: { padding: 15, margin: 5, backgroundColor: '#eee', borderRadius: 8 },
  selectedButton: { backgroundColor: '#007bff' },
  choiceButtonText: { textAlign: 'center', color: '#333' },
  submitButton: { backgroundColor: '#007bff', padding: 20, borderRadius: 8, marginTop: 20 },
  submitButtonText: { textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' },
  Notes: { position: 'absolute', top: 10, right: 30,}
});

export default MyScreen;
