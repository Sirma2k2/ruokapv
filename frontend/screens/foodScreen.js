import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Modal, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddFoodScreen = ({ navigation }) => {
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [calories, setCalories] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [submittedFoodName, setSubmittedFoodName] = useState('');
  const [submittedAmount, setSubmittedAmount] = useState('');
  const [submittedCalories, setSubmittedCalories] = useState('');
  const [meals, setMeals] = useState([]); // Lisätään tila tallennetuille aterioille

  useEffect(() => {
    // Ladataan tallennetut ateriat AsyncStoragesta sovelluksen käynnistyessä
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

  const handleAddFood = async () => {
    if (!foodName || !amount) {
      alert('Anna ruoan nimi ja määrä ensin (kalorit ovat valinnaiset)');
      return;
    }

    const newMeal = { foodName, amount, calories };
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);

    // Tallennetaan uudet ateriat AsyncStorageen
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
    <View style={styles.container}>
      <Text style={styles.text}>Anna ruoan nimi ja kalorit</Text>
      <TextInput 
        style={styles.input}
        placeholder="Ruoan nimi" 
        value={foodName} 
        onChangeText={setFoodName} 
      />
      <TextInput 
        style={styles.input}
        placeholder="Määrä (g)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount} 
      />
      <TextInput 
        style={styles.input}
        placeholder="Kalorit (valinnainen)" 
        keyboardType="numeric" 
        value={calories} 
        onChangeText={setCalories} 
      />
      <Button
        style={styles.button}
        title="Lisää" 
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
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Ruokapäiväkirjaan lisätty:</Text>
          <Text style={styles.modalText}>{submittedFoodName}</Text>
          <Text style={styles.modalText}>Määrä: {submittedAmount} g</Text>
          {submittedCalories && !isNaN(submittedCalories) && (
            <Text style={styles.modalText}>jossa Kaloreita: {submittedCalories}</Text>
          )}
          <Button title="Sulje" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Lista tallennetuista aterioista */}
      <FlatList
        data={meals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{`${item.foodName} - ${item.amount} g${item.calories ? ' - Kaloreita: ' + item.calories : ''}`}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 100,
  },
  input: {
    marginVertical: 10,
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    padding: 10,
    marginVertical: 15,
  },
  text: {
    marginVertical: 15,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddFoodScreen;