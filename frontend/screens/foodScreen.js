import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Modal, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeContext';  // hook

const AddFoodScreen = ({ navigation }) => {
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [calories, setCalories] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [submittedFoodName, setSubmittedFoodName] = useState('');
  const [submittedAmount, setSubmittedAmount] = useState('');
  const [submittedCalories, setSubmittedCalories] = useState('');
  const [meals, setMeals] = useState([]); // Store meals

  const { theme } = useTheme();  //teema

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
    if (!foodName || !amount) {
      alert('Give food name and amount (calories are optional)'); 
      return;
    }
    if (isNaN(amount)) {
      alert('Amount must be a number');
      return;
    }

    const newMeal = { foodName, amount, calories };
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
    } catch (error) {
      console.error('Failed to save meals', error);
    }

    setSubmittedFoodName(foodName);
    setSubmittedAmount(amount);
    setSubmittedCalories(calories);
    setModalVisible(true);

    setFoodName('');
    setAmount('');
    setCalories('');
  };

  return (
    <View style={[styles.container, theme.container]}>
      <Text style={[styles.text, theme.text]}>Plugin your meal</Text>
      <TextInput 
        style={[styles.input, theme.input]}
        placeholder="The name of the food" 
        value={foodName} 
        onChangeText={setFoodName} 
      />
      <TextInput 
        style={[styles.input, theme.input]}
        placeholder="Amount (g)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount} 
      />
      <TextInput 
        style={[styles.input, theme.input]}
        placeholder="Calories (optional)" 
        keyboardType="numeric" 
        value={calories} 
        onChangeText={setCalories} 
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
          <Text style={[styles.modalText, theme.text]}>{submittedFoodName}</Text>
          <Text style={[styles.modalText, theme.text]}>Amount: {submittedAmount} g</Text>
          {submittedCalories && !isNaN(submittedCalories) && (
            <Text style={[styles.modalText, theme.text]}>and the calories: {submittedCalories}</Text>
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
