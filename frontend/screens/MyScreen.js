import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Modal, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class MyScreen extends Component {
  state = {
    menuBarVisible: false,
    settingsVisible: false,
  };

  toggleMenu = () => { 
    this.setState({ menuBarVisible: !this.state.menuBarVisible });
  };

  toggleSettings = () => { 
    this.setState({ settingsVisible: !this.state.settingsVisible });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>MyScreen</Text>
        <TouchableOpacity onPress={this.toggleMenu} style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.menuBarVisible}
          onRequestClose={this.toggleMenu}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={this.toggleSettings} style={styles.menuItem}>
                <Ionicons name="cog-outline" size={24} color="black" />
                <Text style={styles.menuItemText}>Asetukset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.toggleMenu} style={styles.closeButton}>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text style={styles.closeButtonText}>Takaisin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          animationType="slide"
          visible={this.state.settingsVisible}
          onRequestClose={this.toggleSettings}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.settingsContainer}>
              <Text style={styles.settingsTitle}>Settings</Text>
              <Text>Setting1</Text>
              <Text>Setting2</Text>
              <Text>Setting3</Text>
              <Text>Setting4</Text>
              <TouchableOpacity onPress={this.toggleSettings} style={styles.closeButton}>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  menuText: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 8,
  },
  settingsContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
});