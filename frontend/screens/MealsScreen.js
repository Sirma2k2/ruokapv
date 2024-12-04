import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { useTheme } from '../components/ThemeContext'; // Import the useTheme hook
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import { FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Picker } from '@react-native-picker/picker';

import ServerIp from '../hooks/Global';

const MealsScreen = () => {
  const { theme } = useTheme(); // Access the theme from context
  const [searchMeals, setSearchMeals] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodResults, setFoodResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Food'); 

  const searchFood = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(ServerIp + `/api/searchFood?query=${query}`);
      if (response.ok) {
        const data = await response.json()
        setFoodResults(data);
      } else {
        setError('No products found')
      }
    } catch (error) {
      setError('Failed to fetch food data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchMeals.length > 2) {
      searchFood(searchMeals)
    } else {
      setFoodResults([])
    }
  }, [searchMeals])

  function extractServingSize(servingSizeStr) {
    const match = servingSizeStr.match(/(\d+)/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
}

  const saveFoodMeal = async(food) => {
    console.log('New meal created:', food);

    try {
      const response = await fetch(ServerIp + '/api/add-food', {
        method: 'POST', 
        headers: { 
          'content-type': 'application/json',
        }, 
        body: JSON.stringify({
          knimi: 'kovakoodinimi',
          ruokanimi: food.abbreviated_product_name,
          maarag: extractServingSize(food.serving_size),
          kalorit: food.nutriments?.['energy-kcal']
          //img: food.image_small_url
        }),
      })
      if (response.ok) {
        console.log('Successfully added')
        alert('Food saved successfully') 
      } else { 
        console.log('Failed: ', response.status)
        alert('Error in saving food')
        
      }
      } catch(error) {
        
        console.error('Error:', error)
      }

    setModalVisible(false)
  }

  const saveMeal = (food) => {
    console.log('New meal created:', food)
    setModalVisible(false)
  }

  return (
<View style={[theme.container, { padding: 16 }]}>
  <Text style={[styles.header, { color: theme.text.color }]}>Create a Meal</Text>

      <Text style={[styles.label, theme.text]}>Meal name</Text>
      <TextInput
        style={[styles.input, theme.input]}
        placeholder="Enter meal name"
        theme={{ colors: { background: '#e0e0e0' } }}
      />

      {/* Category filter */}
      <View style={styles.categorys}>
        <Text style={[styles.categoryLabel, { color: theme.text.color }]}>Category:</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.pickerStyle}
          mode="dropdown" 
        >
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Drink" value="Drink" />
          <Picker.Item label="Salad" value="Salad" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* ds */}
    
        <Searchbar
          placeholder={`Search for ${category}s`}
          onChangeText={setSearchMeals}
          value={searchMeals}
        />
    
      {/* Loading indicator */}
      {loading && <ActivityIndicator size="large" color="#ff0" />}

      {/* Error message */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      {/* Search results */}
      {category !== 'All' && (
        <FlatList
          data={foodResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Animatable.View animation="fadeIn" duration={400}>
              <TouchableOpacity
                style={styles.foodItem}
                onPress={() => {
                  setSelectedFood(item);
                  setModalVisible(true);
                }}
              >
                <Text style={{ color: theme.text.color }}>
                {item.product_name || 'No name'}
              </Text>
              <Text style={{ color: theme.text.color }}>
                {item.brands || 'No brand'}
              </Text>
              <Text style={{ color: theme.text.color }}>
                  Amount: {item.quantity || 'N/A'}
                </Text>
              <Text style={{ color: theme.text.color }}>
                Protein: {item.nutriments?.proteins_100g || 'N/A'} g
              </Text>
              <Text style={{ color: theme.text.color }}>
                Calories: {item.nutriments?.['energy-kcal'] || 'N/A'} kcal
              </Text>
              <Text style={{ color: theme.text.color }}>
                  Carbohydrates: {item.nutriments?.carbohydrates_100g || 'N/A'} g
                </Text>
                <Text style={{ color: theme.text.color }}>
                  Fat: {item.nutriments?.fat_100g || 'N/a'} g
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        />
      )}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay.backgroundColor }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.modalContainer.backgroundColor }]}>
            {selectedFood ? (
              <>
                <Text style={[styles.modalText, { color: theme.text.color }]}>
                  Name: {selectedFood.product_name || 'N/A'}
                </Text>
                <Text style={[styles.modalText, { color: theme.text.color }]}>
                  Brand: {selectedFood.brands || 'N/A'}
                </Text>
                <Text style={[styles.modalText, { color: theme.text.color }]}>
                  Quantity: {selectedFood.quantity || 'N/A'}
                </Text>
                <Text style={styles.modalText}>
                  Protein: {selectedFood.nutriments?.proteins_100g || 'N/A'}
                </Text>
                <Text style={styles.modalText}>
                    Carbohydrates: {selectedFood.nutriments?.carbohydrates_100g || 'N/A'}
                </Text>
                <Text style={styles.modalText}>
                    Fat: {selectedFood.nutriments?.fat_100g || 'N/A'}
                </Text>
                <Text style={styles.modalText}>
                    Calories: {selectedFood.nutriments?.['energy-kcal'] || 'N/A'} kcal
                </Text> 
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => saveFoodMeal(selectedFood)}
                >
                  <Text>Save food to meal</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={[styles.modalText, { color: theme.text.color }]}>No food selected</Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => saveFoodMeal(selectedFood)}
      >
        <Text>Save meal</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF', // Active tab underline color
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#007AFF', // Active tab text color
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 20,
    width: '90%',
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
    backgroundColor: '#f9f9f9',
    borderColor: '#b0b0b0',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: 'blue',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  foodItem: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '80%',
    backgroundColor: '#f0f0f0',
  },
  mealItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e9e9e9',
    borderRadius: 5,
    width: '80%',
  },
  mealText: {
    fontSize: 16,
    color: '#333',
  },
  categorys: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9', 
    borderRadius: 8,
    borderWidth: 1, 
    borderColor: '#ccc', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
  },
  categoryLabel: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold', 
    color: '#333', 
  },
  pickerStyle: {
    flex: 1,
    height: 50, 
    color: '#333',
    fontSize: 16, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    paddingHorizontal: 8, 
  },
});

export default MealsScreen;
