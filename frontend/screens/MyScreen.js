import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Modal, StyleSheet, TextInput, ScrollView, Settings } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../components/ThemeContext';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import SettingsModal from '../components/SettingsModal';

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

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [switchValues, setSwitchValues] = useState({
    option1: false,
    option2: false,
    option3: false,
  });

  const toggleSettingsVisible = () => {
    setSettingsVisible(!settingsVisible);
    console.log("Settings Modal State:", !settingsVisible);
  };

  const { theme, toggleTheme } = useTheme();

  const handleSwitchChange = (key) => (newValue) => {
    setSwitchValues((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleInputChange = (name) => (value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('User Data:', userData);
  };

  const setLog = () => {
    console.log("MenuBar State:", menuBarVisible);
  }

  return (
    <View style={[styles.container, theme.container]}>
        {/* SettingsModal */}
        <SettingsModal
        visible={settingsVisible}
        toggleVisible={toggleSettingsVisible}
        switchValues={switchValues}
        handleSwitchChange={handleSwitchChange}
        toggleTheme={toggleTheme}
      />

      <TouchableOpacity style={styles.Notes} onPress={() => {
        console.log("navigate to notes");
        navigation.navigate('NotesScreen');
      }}>
      <Ionicons name="document-text" size={30} color={theme.text.color} />
      </TouchableOpacity>
      <View style={styles.topRightContainer}></View>
      <TouchableOpacity style={styles.settingsIcon} onPress={() => {
      console.log("Settings button pressed");
      setSettingsVisible(!settingsVisible);
    }}>
      <Ionicons name="menu" size={30} color={theme.text.color} />
    </TouchableOpacity>

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
                  userData.activityLevel === level && {
                    backgroundColor: theme.darkMode ? '#000' : '#007bff'
                  },
                ]}
                onPress={() => handleInputChange('activityLevel')(level)}
              >
                <Text
                  style={[
                    styles.choiceButtonText,
                    userData.activityLevel === level && {
                      color: theme.darkMode ? '#fff' : '#333'
                    },
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
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
                userData.dietType === diet && {
                  backgroundColor: theme.darkMode ? '#000' : '#007bff'
                },
              ]}
              onPress={() => handleInputChange('dietType')(diet)}
            >
              <Text
                style={[
                  styles.choiceButtonText,
                  userData.dietType === diet && {
                    color: theme.darkMode ? '#fff' : '#333'
                  },
                ]}
              >
                {diet.charAt(0).toUpperCase() + diet.slice(1)}
              </Text>
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
                userData.goal === goal && {
                  backgroundColor: theme.darkMode ? '#000' : '#007bff'
                },
              ]}
              onPress={() => handleInputChange('goal')(goal)}
            >
              <Text
                style={[
                  styles.choiceButtonText,
                  userData.goal === goal && {
                    color: theme.darkMode ? '#fff' : '#333'
                  },
                ]}
              >
                {goal.charAt(0).toUpperCase() + goal.slice(1)}
              </Text>
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
  Notes: { position: 'absolute', top: 50, right: 30, margin: 5, padding: 5 },
  settingsIcon: { position: 'absolute', top: 10, right: 30, zIndex: 1, margin: 5, padding: 5 },
});

export default MyScreen;
