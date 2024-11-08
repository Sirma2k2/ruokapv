import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Modal, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../components/ThemeContext'; // Import useTheme hook
import Checkbox from 'expo-checkbox';

const MyScreen = () => {
  const [menuBarVisible, setMenuBarVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({ // default checkbox values
    option1: false,
    option2: false,
    option3: false,
    option4: false,
    option5: false,
  });
  const { theme, toggleTheme } = useTheme(); // Use theme and toggleTheme from context

  // Handle checkbox changes using a switch statement
  const handleCheckboxChange = (key) => (newValue) => {
    switch (key) {
      case 'option1':
        setCheckboxValues(prev => ({ ...prev, option1: newValue }));
        break;
      case 'option2':
        setCheckboxValues(prev => ({ ...prev, option2: newValue }));
        break;
      case 'option3':
        setCheckboxValues(prev => ({ ...prev, option3: newValue }));
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.text, theme.text]}>MyScreen</Text>
      <TouchableOpacity onPress={() => setMenuBarVisible(!menuBarVisible)} style={styles.menuButton}>
        <Text style={[styles.menuText, theme.text]}>☰</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={menuBarVisible}
        onRequestClose={() => setMenuBarVisible(false)}
      >
        <View style={theme.modalOverlay}>
          <View style={theme.modalContainer}>
            <Text style={[styles.menuTitle, theme.text]}>Menu</Text>
            <TouchableOpacity onPress={() => setSettingsVisible(!settingsVisible)} style={styles.menuItem}>
              <Ionicons name="cog-outline" size={24} color={theme.text.color} />
              <Text style={[styles.menuItemText, theme.text]}>Settings</Text>
            </TouchableOpacity>
            {/* Dark-light mode button */}
            <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
              <Ionicons name="contrast-outline" size={24} color={theme.text.color} />
              <Text style={[styles.menuItemText, theme.text]}>Toggle Dark Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuBarVisible(false)} style={styles.closeButton}>
              <Ionicons name="arrow-back-outline" size={24} color={theme.text.color} />
              <Text style={[styles.closeButtonText, theme.text]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={theme.modalOverlay}>
          <View style={theme.modalContainer}>
            <Text style={[styles.settingsTitle, theme.text]}>Settings</Text>
         
            <Checkbox
              style={styles.checkbox}
              value={checkboxValues.option1}
              onValueChange={handleCheckboxChange('option1')}
            />
            <Text style={[styles.menuItemText, theme.text]}>Option 1</Text>

            <Checkbox
              style={styles.checkbox}
              value={checkboxValues.option2}
              onValueChange={handleCheckboxChange('option2')}
            />
            <Text style={[styles.menuItemText, theme.text]}>Option 2</Text>

            <Checkbox
              style={styles.checkbox}
              value={checkboxValues.option3}
              onValueChange={handleCheckboxChange('option3')}
            />
            <Text style={[styles.menuItemText, theme.text]}>Option 3</Text>

            {/* Dark-light mode button */}
            <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
              <Ionicons name="contrast-outline" size={24} color={theme.text.color} />
              <Text style={[styles.menuItemText, theme.text]}>Toggle Dark Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSettingsVisible(false)} style={styles.menuItem}>
              <Ionicons name="arrow-back-outline" size={24} color={theme.text.color} />
              <Text style={[styles.menuItemText, theme.text]}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16 },
  menuButton: { position: 'absolute', top: 40, right: 20, padding: 10 },
  menuText: { fontSize: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' },
  modalContainer: { backgroundColor: 'white', padding: 20, marginHorizontal: 40, borderRadius: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuItemText: { fontSize: 16, marginLeft: 10 },
  menuTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  settingsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  closeButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  closeButtonText: { fontSize: 16, marginLeft: 10 },
  checkbox: { marginVertical: 10 },
});

export default MyScreen;
