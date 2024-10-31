
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const AddFoodScreen = ({ navigation }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');

  const handleAddFood = () => {
    // Tallenna ruoka AsyncStorageen tai SQLiteen
    navigation.goBack();
  };

  return (
    <View>
      <TextInput 
        placeholder="Ruoan nimi" 
        value={foodName} 
        onChangeText={setFoodName} 
      />
      <TextInput 
        placeholder="Kalorit" 
        keyboardType="numeric" 
        value={calories} 
        onChangeText={setCalories} 
      />
      <Button title="Lisää" onPress={handleAddFood} />
    </View>
  );
};

export default AddFoodScreen;
