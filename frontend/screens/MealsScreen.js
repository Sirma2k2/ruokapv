import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { useTheme } from '../components/ThemeContext'; // Import the useTheme hook
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import { FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Picker } from '@react-native-picker/picker';
import { getUserData } from '../hooks/UserData';

import { useNavigation } from '@react-navigation/native'; // Import useNavigation and useRoute hooks

import { SaveFood } from '../hooks/SaveFood';


import ServerIp from '../hooks/Global';

const MealsScreen = ({ _navigation }) => {
  const { theme } = useTheme(); // Access the theme from context

  const navigation = useNavigation(); // Initialize navigation
  const route = useRoute(); // Get the current route
  const screenName = route.name; // Get the screen name
  const mealType = screenName.replace('Screen', '').toLowerCase(); // Determine the meal type dynamically

  //const navigation = useNavigation(); // Initialize navigation

  const [searchMeals, setSearchMeals] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false); // State for confirmation modal
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodResults, setFoodResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Food'); 
  const [MealName, setMealName] = useState('')
  const [search, setSearch] = useState('')
  const [foods, setFoods] = useState([]);
  const [MealType, setMealType] = useState(selectedMealType || '')
  const { selectedMealType } = route.params || {}; 

  const searchFood = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(ServerIp + `/api/searchFood?query=${query}`);
      if (response.ok) {
        const data = await response.json()
        const filteredData = data.filter(item => item.nutriments && item.nutriments['energy-kcal'] && item.nutriments['energy-kcal'] !== 0 && item.quantity && item.quantity !== 0);
        setFoodResults(filteredData);
      } else {
        setError('No products found');
        setTimeout(() => setError(''), 5000);
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
    try{
      const match = servingSizeStr.match(/(\d+)/);
      if (match) {
          return parseInt(match[1], 10);
      }
      return null;
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    if (selectedMealType) {
        setMealType(selectedMealType);
    }
}, [selectedMealType]);

  const saveFoodMeal = async(food) => {
    //TALLENNETAAN YKSITTÄINEN RUOKA LISTASTA
    console.log('New food adding: ', food.product_name);
    
    const user = await getUserData();
    const uname = user[0]?.knimi;
    const ateria = "meal";
    const consumedAmount = extractServingSize(food.quantity || food.quantity || "100");

    console.log(uname, " ", ateria, " ",consumedAmount);

    const response = await SaveFood(food, ateria, uname, consumedAmount);

    if (response.ok) {

      console.log("response.ok");

      const data = await response.json();
      const resid = data.id[0]?.id;

      const proteinPerGram = food.nutriments?.proteins_100g || 0;
      const carbsPerGram = food.nutriments?.carbohydrates_100g || 0;
      const fatPerGram = food.nutriments?.fat_100g || 0;
      const caloriesPerGram = food.nutriments?.['energy-kcal'] || 0;
      const proteinAmount = (proteinPerGram * consumedAmount) / 100;
      const carbsAmount = (carbsPerGram * consumedAmount) / 100;
      const fatAmount = (fatPerGram * consumedAmount) / 100;
      const caloriesAmount = (caloriesPerGram * consumedAmount) / 100;

      //Saatu ruoka lisätään listaan joka lähetetään myöhemmin kokonaisuudessaan backendiin.
      //Tätä voi käyttää mm. valittujen aterioiden näyttämiseen
      //suurin osa ominaisuuksista vielä kovakoodattu.

      const newFood = {
        id: resid, //tämä id on juuri tämän ruuan id databasessa ja sitä tarvitaan /get-meal:issä
        knimi: user[0]?.knimi || "N/A",
        ruokanimi: food?.product_name || food.brands || "N/A", //nyt toimii :)
        maarag: consumedAmount,
        kalorit: Math.round(caloriesAmount),
        proteiini: Math.round(proteinAmount),
        hiilihydraatit: Math.round(carbsAmount),
        rasvat: Math.round(fatAmount),
        tyyppi: category?.toLowerCase() || "food",
        picture: food?.image_small_url || "",
      };


      setFoods((prevFoods) => {
        const updatedFoods = [...prevFoods, newFood];
        console.log('foods:', updatedFoods); // Log updated foods
        return updatedFoods;
      });

      console.log(foods);

      console.log('Successfully added')
      alert('Food saved successfully') 
    } else { 
      console.log('Failed: ', response.status)
      alert('Error in saving food')
      
    }
    setModalVisible(false)

    /*
    try {
      //lähetetään ruoka databaseen
      const user = await getUserData();
      const response = await fetch(ServerIp + '/api/add-food', {
        method: 'POST', 
        headers: { 
          'content-type': 'application/json',
        }, 
        body: JSON.stringify({
          knimi: user[0]?.knimi || "Kovakoodi",
          ruokanimi: food?.product_name || "Failsafe", //Nyt toimii :)
          maarag: 200, //extractServingSize(food[0]?.serving_size), //VÄLIAIKAINEN
          kalorit: food.nutriments?.['energy-kcal'],
          proteiini: 0,
          hiilihydraatit: 0,
          rasvat: 0,
          tyyppi: category.toLowerCase(),
          img: food.image_small_url
        }),
      })
      if (response.ok) {

        const data = await response.json();
        const resid = data.id[0]?.id;

        //Saatu ruoka lisätään listaan joka lähetetään myöhemmin kokonaisuudessaan backendiin.
        //Tätä voi käyttää mm. valittujen aterioiden näyttämiseen
        //suurin osa ominaisuuksista vielä kovakoodattu.

        const newFood = {
          id: resid, //tämä id on juuri tämän ruuan id databasessa ja sitä tarvitaan /get-meal:issä
          knimi: user[0]?.knimi || "Kovakoodi",
          ruokanimi: food?.product_name || "Failsafe", //Nyt toimii :)
          maarag: 200,
          kalorit: food[0]?.nutriments?.['energy-kcal'] || 0,
          proteiini: 0,
          hiilihydraatit: 0,
          rasvat: 0,
          tyyppi: category?.toLowerCase() || "food",
          img: food[0]?.image_small_url || "",
        };

        setFoods((prevFoods) => {
          const updatedFoods = [...prevFoods, newFood];
          console.log('foods:', updatedFoods); // Log updated foods
          return updatedFoods;
        });

        console.log(foods);

        console.log('Successfully added')
        alert('Food saved successfully') 
      } else { 
        console.log('Failed: ', response.status)
        alert('Error in saving food')
        
      }
    } catch(error) {
      
      console.error('Error:', error)
    }
    */
  }

  const saveMeal = async () => {
    //TALLENNETAAN ATERIA
    try {
      const user = await getUserData();
      const foodIds = foods.map((food) => food.id)
      const response = await fetch(ServerIp + '/api/add-meal', {
        method: 'POST', 
        headers: { 
          'content-type': 'application/json',
        }, 
        body: JSON.stringify({

          ateria: mealType, // Use the dynamically determined meal type
          knimi: user[0]?.knimi || "Kovakoodi",
          mealname: MealName,
          food: foodIds[0]  || null, //Rivillä 96 mainittu id tähän. toistaiseksi kovakoodattu
          drink: foodIds[1] || null,
          salad: foodIds[2] || null,
          other: foodIds[3] || null
        }),
      })
      if (response.ok) {
        alert("Meal saved successfully, good job!");
        setFoods([]); //Tyhjennetään lista
        navigation.goBack();
      } else { 
        alert("error");
      }
      } catch(error) {
        console.error('Error:', error);
      }
    setModalVisible(false)
  }

  const handleSaveMeal = () => {
    if(!MealName) {
      alert('Please enter a meal name and add some food items');
      return;
    }
    if (foods.length === 0) {
      alert('Please add some food items to the meal before saving');
      return;
    }
    setConfirmationVisible(true); // Show confirmation modal
  }

  const handleConfirmSave = () => {
    setConfirmationVisible(false); // Hide confirmation modal
    saveMeal(); // Proceed with saving the meal
  }

  return (
<View style={[theme.container, { padding: 16 }]}>
  <Text style={[styles.header, { color: theme.text.color }]}>Create a Meal</Text>

      <Text style={[styles.label, theme.text]}>Meal name</Text>
      <TextInput
        style={[styles.input, theme.input]}
        placeholder="Enter meal name"
        value={MealName}
        onChangeText={(text) => setMealName(text)}
        theme={{ colors: { background: '#e0e0e0' } }}
      />

{MealName ? (
  <>
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
          style={[styles.searchBar]}
          placeholder={`Search for ${category}s`}
          onChangeText={setSearchMeals}
          value={searchMeals}
        />
      </>
      ) : null }

      

    
      
    
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
                  style={[styles.button, styles.buttoText]}
                  onPress={() => saveFoodMeal(selectedFood)}
                >
                  <Text>Save food to meal</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={[styles.modalText, { color: theme.text.color }]}>No food selected</Text>
            )}
            <TouchableOpacity
            style={[styles.button, styles.buttoText]}
              onPress={() => setModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationVisible}
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Have you added all items?</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttoText]}
              onPress={handleConfirmSave}
            >
              <Text>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttoText]}
              onPress={() => setConfirmationVisible(false)}
            >
              <Text>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
      style={[styles.button, styles.buttoText]}
        onPress={handleSaveMeal}
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
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#4169e1',
    width: '90%', 
    alignSelf: 'center',  
    marginVertical: 10,  
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,  
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