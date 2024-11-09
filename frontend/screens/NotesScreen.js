import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const NotesScreen = () => {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(currentDate);
    }
  };

  return (
    <View style={styles.container}>
     
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          value={date.toLocaleDateString()} 
          editable={false} 
          style={styles.input}
          theme={{ colors: { background: '#e0e0e0' } }}
        />
      </TouchableOpacity>

     
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

     
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={text => setTitle(text)}
        style={styles.input}
        theme={{ colors: { background: '#e0e0e0' } }}
      />

      
      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={text => setDescription(text)}
        multiline
        style={[styles.input, styles.descriptionInput]}
        theme={{ colors: { background: '#e0e0e0' } }}
      />

      
      <Button title="Save" onPress={() => { /* Handle Save Action */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    fontSize: 16,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderColor: '#b0b0b0',
    borderWidth: 1,
    borderRadius: 5,
  },
  descriptionInput: {
    height: 100,
  },
});

export default NotesScreen;
