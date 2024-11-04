import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Modal, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

export default class MyScreen extends Component {
  state = {
    menuBarVisible: false, 
  }

  toggleMenu = () => {
    this.setState({ menuBarVisible: !this.state.menuBarVisible })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>MyScreen</Text>

        <TouchableOpacity onPress={this.toggleMenu} style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="fade"
          visible={this.state.menuBarVisible}
          onRequestClose={this.toggleMenu}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>Menu</Text>

              {/* Asetukset-nappi */}
              <TouchableOpacity onPress={this.toggleMenu} style={styles.menuItem}>
                <Ionicons name="cog-outline" size={24} color="black" />
                <Text style={styles.menuItemText}>Asetukset</Text>
              </TouchableOpacity>

              {/* Dark-light mode nappi */}
              <TouchableOpacity onPress={this.toggleMenu} style={styles.menuItem}>
                <Ionicons name="contrast-outline" size={24} color="black" />
              </TouchableOpacity>

              {/* Hampparivalikko pois */}
              <TouchableOpacity onPress={this.toggleMenu} style={styles.menuItem}>
                <Ionicons name="arrow-back-outline" size={24} color="black" />
                <Text style={styles.menuItemText}>Takaisin</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      </View>
    )
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
});
