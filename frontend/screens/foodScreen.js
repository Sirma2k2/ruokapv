import React, { useState } from 'react';
import { View, TextInput, Button, Text, Modal, StyleSheet } from 'react-native';
//import { ActivityIndicator, MD2Colors } from 'react-native-paper'; // Myöhemmin käytettäväksi

const AddFoodScreen = ({ navigation }) => {
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [calories, setCalories] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Modalin näkyvyys
  const [submittedFoodName, setSubmittedFoodName] = useState(''); // Tallennetaan lisätty ruoka
  const [submittedAmount, setSubmittedAmount] = useState(''); // Tallennetaan lisätty määrä
  const [submittedCalories, setSubmittedCalories] = useState(''); // Tallennetaan lisätyt kalorit

  const handleAddFood = () => {
    if (!foodName && !amount) {
      alert('Anna ruoan nimi ja määrä ensin (kalorit ovat valinnaiset)');
      return;
    }
    if (!foodName) {
        alert('Anna ruoan nimi ensin');
        return;
    }
    if (!amount) {
      alert('Anna ruoan määrä ensin');
      return;
    }
    if (isNaN(amount)) {
      alert('Määrän tulee olla numero');
      return;
    }

    // Tallennetaan lisätyt tiedot modalin näyttämistä varten
    setSubmittedFoodName(foodName);
    setSubmittedAmount(amount); // Korjattu käytetään submittedAmountia
    setSubmittedCalories(calories);

    // Avaa modal onnistuneen lisäyksen jälkeen
    setModalVisible(true);

    // Tyhjennetään input-kentät
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
          {/* Ehtolause kalorimäärän näyttämiseksi */}
          {submittedCalories && !isNaN(submittedCalories) && (
            <Text style={styles.modalText}>jossa Kaloreita: {submittedCalories}</Text>
          )}
          <Button title="Sulje" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
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
