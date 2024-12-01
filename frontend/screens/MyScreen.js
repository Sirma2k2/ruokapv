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

const MyScreen = () => {  // VIELÄ KEHITYKSESSÄ
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    dietType: "",
    goal: "",
  });

  const loadUserData = async () => {
    try {
      const storedData = await SecureStore.getItemAsync("userData");
      console.log("Stored data:", storedData); // Log the stored data to check
  
      if (storedData) {
        const parsedData = JSON.parse(storedData);
  
        // Log parsedData to verify its structure
        console.log("Parsed data:", parsedData);
  
        // Map the stored data keys to your expected state keys
        const mappedData = {
          name: parsedData.knimi || "", // "knimi" is stored as the name
          email: parsedData.email || "",
          age: parsedData.ika || "", // "ika" is stored as the age
          weight: parsedData.paino || "", // "paino" is stored as weight
          height: parsedData.pituus || "", // "pituus" is stored as height
          activityLevel: parsedData.aktiviteetti || "", // "aktiviteetti" is stored as activity level
          dietType: parsedData.tyyppi || "", // "tyyppi" is stored as diet type
          goal: parsedData.tavoite || "", // "tavoite" is stored as goal
        };
  
        console.log("Mapped user data:", mappedData); // Log mapped data to verify
        setUserData(mappedData); // Set the mapped data to the state
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };
  
  

  useEffect(() => {// when something changes, this is called
    loadUserData();
  }, []);

  const handleInputChange = (name) => (value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = { ...userData };
      await SecureStore.setItemAsync("userData", JSON.stringify(updatedData)); // Save updated data
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Values for the pickers
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={userData.name}
          editable={false} // Read-only
        />
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          editable={false} // Read-only
        />
      </View>

      {/* Age */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={userData.age}
          editable={false} // Read-only
        />
      </View>

      {/* Weight */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={userData.weight}
          onChangeText={handleInputChange("weight")}
        />
      </View>

      {/* Height */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={userData.height}
          onChangeText={handleInputChange("height")}
        />
      </View>

      {/* Activity Level */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Activity Level</Text>
        <RNPickerSelect
          placeholder={{ label: "Select activity level", value: null }}
          value={userData.activityLevel}
          onValueChange={handleInputChange("activityLevel")}
          items={activityLevels}
          style={pickerStyle}
        />
      </View>

      {/* Diet Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Diet Type</Text>
        <RNPickerSelect
          placeholder={{ label: "Select diet type", value: null }}
          value={userData.dietType}
          onValueChange={handleInputChange("dietType")}
          items={dietTypes}
          style={pickerStyle}
        />
      </View>

      {/* Goal */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Goal</Text>
        <RNPickerSelect
          placeholder={{ label: "Select goal", value: null }}
          value={userData.goal}
          onValueChange={handleInputChange("goal")}
          items={goals}
          style={pickerStyle}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const pickerStyle = {
  inputAndroid: { fontSize: 18, padding: 10, borderWidth: 1, borderRadius: 8, borderColor: "#ddd", backgroundColor: "#fff", marginBottom: 20,},
  inputIOS: { fontSize: 18, padding: 10, borderWidth: 1, borderRadius: 8, borderColor: "#ddd", backgroundColor: "#fff", marginBottom: 20,},
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f0f0" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { fontSize: 16, marginBottom: 5, color: "#333" },
  inputGroup: { marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyScreen;
