import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import RNPickerSelect from "react-native-picker-select";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../components/ThemeContext"; 
import SettingsModal from "../components/SettingsModal";
import { useNavigation } from '@react-navigation/native';

const MyScreen = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({ 
    knimi: "",
    email: "",
    ika: "",
    paino: "",
    pituus: "",
    aktiviteetti: "",
    tyyppi: "",
    tavoite: "",
  });

  const { theme, toggleTheme } = useTheme();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [switchValues, setSwitchValues] = useState({
    option1: false,
    option2: false,
    option3: false,
  });

  const toggleSettingsVisible = () => {
    setSettingsVisible(!settingsVisible);
  };

  const handleSwitchChange = (key) => (newValue) => {
    setSwitchValues((prev) => ({ ...prev, [key]: newValue }));
  };
  
  const handleRefresh = () => {
    loadUserData();
  };

  const loadUserData = async () => {
    try {
      const storedData = await SecureStore.getItemAsync("userData");
      if (storedData) {
        console.log("LOAD Stored: ", storedData)
        const parsedData = JSON.parse(storedData);
        const mappedData = {
          knimi: parsedData[0]?.knimi || "",
          email: parsedData[0]?.email || "",
          ika: parsedData[0]?.ika || "",
          paino: parsedData[0]?.paino || "",
          pituus: parsedData[0]?.pituus || "",
          aktiviteetti: parsedData[0]?.aktiviteetti ? activityLevels[parsedData[0]?.aktiviteetti - 1].value : "",
          tyyppi: parsedData[0]?.tyyppi ? dietTypes[parsedData[0]?.tyyppi - 1].value : "",
          tavoite: parsedData[0]?.tavoite ? goals[parsedData[0]?.tavoite - 1].value : "",
        }; 
        setUserData(mappedData);
        console.log("LOAD Mapped data: ", mappedData);
        return mappedData;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  useEffect(() => {
    loadUserData();
    console.log("Loaded: ", userData);
  }, []);

  const handleInputChange = (name) => (value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...userData,
        activityLevel: activityLevels.findIndex(level => level.value === userData.activityLevel) + 1,
        dietType: dietTypes.findIndex(type => type.value === userData.dietType) + 1,
        goal: goals.findIndex(goal => goal.value === userData.goal) + 1,
      };
      await SecureStore.setItemAsync("userData", JSON.stringify(updatedData));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const activityLevels = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const dietTypes = [
    { label: "Balanced", value: "balanced" },
    { label: "Keto", value: "keto" },
    { label: "Vegan", value: "vegan" },
  ];

  const goals = [
    { label: "Lose Weight", value: "lose" },
    { label: "Maintain Weight", value: "maintain" },
    { label: "Gain Weight", value: "gain" },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>

      <TouchableOpacity style={styles.Notes} onPress={() => {
        console.log("navigate to notes");
        navigation.navigate('NotesScreen');
      }}>
        <Ionicons name="document-text" size={30} color={theme.text.color} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={handleRefresh}
      >
        <Ionicons name="refresh" size={30} color={theme.text.color} />
      </TouchableOpacity>

      <SettingsModal
        visible={settingsVisible}
        toggleVisible={toggleSettingsVisible}
        switchValues={switchValues}
        handleSwitchChange={handleSwitchChange}
        toggleTheme={toggleTheme}
      />
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={toggleSettingsVisible}
      >
        <Ionicons name="cog-sharp" size={30} color={theme.text.color} />
      </TouchableOpacity>

      <Text style={[styles.title, theme.text]}>My Profile</Text>

      {/* Form Fields */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, theme.text]}>Name</Text>
        <TextInput
          style={[styles.input, { color: theme.text.color }]}
          value={userData.knimi}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, theme.text]}>Email</Text>
        <TextInput
          style={[styles.input, { color: theme.text.color }]}
          value={userData.email}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, theme.text]}>Age</Text>
        <TextInput
          style={[styles.input, { color: theme.text.color }]}
          value={userData.ika.toString()}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, theme.text]}>Weight (kg)</Text>
        <TextInput
          style={[styles.input, { color: theme.text.color }]}
          keyboardType="numeric"
          value={userData.paino.toString()}
          onChangeText={handleInputChange("weight")}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, theme.text]}>Height (cm)</Text>
        <TextInput
          style={[styles.input, { color: theme.text.color }]}
          keyboardType="numeric"
          value={userData.pituus.toString()}
          onChangeText={handleInputChange("height")}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, theme.text]}>Activity Level</Text>
        <RNPickerSelect
          placeholder={{ label: "Select activity level", value: null }}
          value={userData.aktiviteetti}
          onValueChange={handleInputChange("activityLevel")}
          items={activityLevels}
          style={{
            inputIOS: [styles.input, { color: theme.text.color }],
            inputAndroid: [styles.input, { color: theme.text.color }],
          }}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, theme.text]}>Diet Type</Text>
        <RNPickerSelect
          placeholder={{ label: "Select diet type", value: null }}
          value={userData.tyyppi}
          onValueChange={handleInputChange("dietType")}
          items={dietTypes}
          style={{
            inputIOS: [styles.input, { color: theme.text.color }],
            inputAndroid: [styles.input, { color: theme.text.color }],
          }}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, theme.text]}>Goal</Text>
        <RNPickerSelect
          placeholder={{ label: "Select goal", value: null }}
          value={userData.tavoite}
          onValueChange={handleInputChange("goal")}
          items={goals}
          style={{
            inputIOS: [styles.input, { color: theme.text.color }],
            inputAndroid: [styles.input, { color: theme.text.color }],
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton,  { backgroundColor: theme?.container?.backgroundColor || "#ffffff" },
        ]}
        onPress={handleSaveChanges}
      >
        <Text style={[styles.saveButtonText, theme.buttonText]}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { fontSize: 16, marginBottom: 5 },
  inputGroup: { marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  saveButton: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 1,
    margin: 5,
    padding: 5,
  },
  refreshButton: {
    position: "absolute",
    top: -3,
    right: 40,
    padding: 1,
  },  
});

export default MyScreen;