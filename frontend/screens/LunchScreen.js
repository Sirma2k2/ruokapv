import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LunchScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.header}>Build Your Breakfast</Text>
    
    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
      <Text style={styles.buttonText}>Back to Menu</Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center' 
  },
  header: { 
    fontSize: 24, 
    marginTop: 40, 
    marginBottom: 20, 
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: 'black',
    marginVertical: 10, 
  },
  buttonText: {
    color: 'white',  
    fontSize: 18,    
  }
});

export default LunchScreen;
