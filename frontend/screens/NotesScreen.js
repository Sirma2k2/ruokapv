import { Text, View, StyleSheet, Button, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useData } from '../hooks/SaveDataFront';

const NotesScreen = () => {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { getData, saveData } = useData();
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  
  useEffect(() => {
    getData()
      .then((data) => {
        if (data) setNotes(data)
      })
      .catch((error) => console.log(error))
  }, [])

  
  const saveNotes = async () => {
    try {
      await saveData(notes);
    } catch (error) {
      console.log("Failed to save notes:", error)
    }
  }

 
  const addNote = () => {
    if (title.trim() !== '' && description.trim() !== '') {
      const newNote = { title, description, date: date.toLocaleDateString(), done: false }
      const updatedNotes = [...notes, newNote]
      setNotes(updatedNotes)
      setTitle('')
      setDescription('')
      saveNotes()
    }
  }


  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShowDatePicker(false)
    setDate(currentDate)
  }

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index)
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }
  


  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  return (
    <View style={styles.container}>
      {/* Date Picker */}
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

      {/* Title Input */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
        theme={{ colors: { background: '#e0e0e0' } }}
      />

      {/* Description Input */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline
        style={[styles.input, styles.descriptionInput]}
        theme={{ colors: { background: '#e0e0e0' } }}
      />

      {/* Save Button */}
      <Button style={styles.button} title="Add Note" onPress={addNote} />

      {/* View Saved Notes Button */}
      <Button title="View Saved Notes" onPress={toggleModal} />

      {/* Notes Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Saved Notes</Text>
            
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <Text style={styles.noteText}>Title: {note.title}</Text>
                  <Text style={styles.noteText}>Description: {note.description}</Text>
                  <Text style={styles.noteText}>Date: {note.date}</Text>
                  <Button
                    title="Delete note"
                    onPress={() => deleteNote(index)}
                  />
                </View>
              ))
            ) : (
              <Text>No notes saved</Text>
            )}

            {/* Close Modal Button */}
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
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
  button: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noteItem: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  noteText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default NotesScreen;
