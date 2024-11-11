import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MenuModal = ({ visible, toggleVisible, toggleTheme, openSettings }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={toggleVisible}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.menuTitle}>Menu</Text>
          <TouchableOpacity onPress={openSettings} style={styles.menuItem}>
            <Ionicons name="cog-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
            <Ionicons name="contrast-outline" size={24} color="black" />
            <Text style={styles.menuItemText}>Toggle Dark Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleVisible} style={styles.closeButton}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
            <Text style={styles.closeButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' },
  modalContainer: { backgroundColor: 'white', padding: 20, marginHorizontal: 40, borderRadius: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuItemText: { fontSize: 16, marginLeft: 10 },
  menuTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  closeButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  closeButtonText: { fontSize: 16, marginLeft: 10 },
});

export default MenuModal;
