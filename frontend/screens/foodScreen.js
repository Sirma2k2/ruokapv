
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';


const AddFoodScreen = ({ navigation }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');

  const handleAddFood = () => {
    // Tallenna ruoka backendiin
    // ei vielä toteutettu
    navigation.goBack();
  };

  return (
    <View style= {styles.container}>
        <Text>Anna ruoan nimi ja kalorit</Text>
      <TextInput 
        style={styles.input}
        placeholder="Ruoan nimi" 
        value={foodName} 
        onChangeText={setFoodName} 
      />
      <TextInput 
        style={styles.input}
        placeholder="Kalorit" 
        keyboardType="numeric" 
        value={calories} 
        onChangeText={setCalories} 
      />
      <Button
        style={styles.button}
       title="Lisää" onPress={handleAddFood} />
    </View>
  );
};

const styles = {
    container: {
        margin: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginVertical: 10,
    },
};

export default AddFoodScreen;
