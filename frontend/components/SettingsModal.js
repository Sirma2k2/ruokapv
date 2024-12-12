import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NotificationTool from './NotificationTool'; // Import NotificationTool

const SettingsModal = ({ visible, toggleVisible, switchValues, handleSwitchChange, toggleTheme, initialNotificationValue }) => (
  <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
    onRequestClose={toggleVisible}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <NotificationTool initialNotificationValue={initialNotificationValue} />
        <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
          <Ionicons name="contrast-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Toggle Dark Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleVisible} style={styles.menuItem}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' },
  modalContainer: { backgroundColor: 'white', padding: 20, marginHorizontal: 40, borderRadius: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  menuItemText: { fontSize: 16, marginLeft: 10 },
  settingsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
});

export default SettingsModal;