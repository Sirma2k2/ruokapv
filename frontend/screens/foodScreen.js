import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeContext';  // hook

const AddFoodScreen = ({ navigation }) => {
  const [knimi, setKnimi] = useState(''); // käyttäjän nimi
  const [ruokanimi, setRuokanimi] = useState(''); // ruoan nimi
  const [maarag, setMaarag] = useState(''); // määrä
  const [kalorit, setKalorit] = useState(''); // kalorit
  const [modalVisible, setModalVisible] = useState(false);
  const [submittedKnimi, setSubmittedKnimi] = useState('');
  const [submittedRuokanimi, setSubmittedRuokanimi] = useState('');
  const [submittedMaarag, setSubmittedMaarag] = useState('');
  const [submittedKalorit, setSubmittedKalorit] = useState('');
  const [meals, setMeals] = useState([]); // Store meals

  const { theme } = useTheme();  // theme

  useEffect(() => { // load
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('meals');
        if (storedMeals) {
          setMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error('Failed to load meals', error);
      }
    };

    loadMeals();
  }, []);

  const handleAddFood = async () => { // add
    if (!knimi || !ruokanimi || !maarag) {
      alert('Give your name, food name, and amount');
      return;
    }
    if (isNaN(maarag)) {
      alert('Amount must be a number');
      return;
    }

    const newMeal = { knimi, ruokanimi, maarag, kalorit };

    // Lähetetään tiedot backendille
    try {
      const response = await fetch('http://172.20.10.2:3000/api/add-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMeal),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Food added successfully');
        
        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);

        // Save to AsyncStorage
        await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));

        setSubmittedKnimi(knimi);
        setSubmittedRuokanimi(ruokanimi);
        setSubmittedMaarag(maarag);
        setSubmittedKalorit(kalorit);
        setModalVisible(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add food');
      }
    } catch (error) {
      console.error('Failed to add food to the backend', error);
      alert('Something went wrong');
    }

    setKnimi('');
    setRuokanimi('');
    setMaarag('');
    setKalorit('');
  };

  return (
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.text, theme.text]}>Plugin your meal</Text>
      <TextInput 
        style={[styles.input, theme.input]}
        placeholder="Your name" 
        value={knimi} 
        onChangeText={setKnimi} 
      />
      <TextInput 
        style={[styles.input, theme.input]}
        placeholder="Food name" 
        value={ruokanimi} 
        onChangeText={setRuokanimi} 
      />
      <TextInput 
        style={[styles.input, theme.input]}
        placeholder="Amount (g)"
        keyboardType="numeric"
        value={maarag}
        onChangeText={setMaarag} 
      />
      <TextInput 
        style={[styles.input, theme.input]}
        placeholder="Calories (optional)" 
        keyboardType="numeric" 
        value={kalorit} 
        onChangeText={setKalorit} 
      />
      <Button
        title="Add" 
        onPress={handleAddFood} 
      />
      
      {/* Modali */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={[styles.modalView, theme.modalContainer]}>
          <Text style={[styles.modalText, theme.text]}>Added to food diary:</Text>
          <Text style={[styles.modalText, theme.text]}>{submittedKnimi}</Text>
          <Text style={[styles.modalText, theme.text]}>Food: {submittedRuokanimi}</Text>
          <Text style={[styles.modalText, theme.text]}>Amount: {submittedMaarag} g</Text>
          {submittedKalorit && !isNaN(submittedKalorit) && (
            <Text style={[styles.modalText, theme.text]}>and the calories: {submittedKalorit}</Text>
          )}
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { backgroundColor: 'white', marginVertical: 10, width: '80%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalText: { marginBottom: 15, textAlign: 'center' },
});

export default AddFoodScreen;