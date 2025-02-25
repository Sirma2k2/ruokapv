import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Alert, TextInput, Image } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import ServerIp from '../hooks/Global';
import { SaveFood } from '../hooks/SaveFood';
import * as SecureStore from 'expo-secure-store';
import { SearchMeals } from '../hooks/SearchMeals';
import { getUserData } from '../hooks/UserData';

const BreakfastScreen = ({ navigation }) => {
  const { theme } = useTheme(); // Access the theme from context
  const [activeTab, setActiveTab] = useState('addFood'); // Track the active tab
  const [searchBreakfast, setSearchBreakfast] = useState(''); // State for the search bar
  const [modalVisible, setModalVisible] = useState(false); // For Modal visibility
  const [selectedFood, setSelectedFood] = useState(null)
  const [consumedAmount, setConsumedAmount] = useState('');
  const [mealSearch, setMealSearch] = useState('');
  const [mealResults, setMealResults] = useState([]);
  const [allMeals, setAllMeals] = useState([]); // State to store all meals
  const [loadingMeals, setLoadingMeals] = useState(false); // State for loading meals

  // States for food results, loading, and error handling
  const [foodResults, setFoodResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch food data based on search query
  const searchFood = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(ServerIp + `/api/searchFood?query=${query}`);
      if (response.ok) {
        const data = await response.json();
        // Filter out items that do not have calorie information
        const filteredData = data.filter(item => item.nutriments && item.nutriments['energy-kcal'] && item.nutriments['energy-kcal'] !== 0 && item.quantity && item.quantity !== 0);
        setFoodResults(filteredData);
      } else {
        setError('No products found');
        setTimeout(() => setError(''), 5000);
      }
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch food data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchBreakfast.length > 2) {
      searchFood(searchBreakfast);
    } else {
      setFoodResults([]);
    }
    if (mealSearch.length > 0) {
      const filteredMeals = allMeals.filter(meal => 
        meal.mealname.toLowerCase().includes(mealSearch.toLowerCase())
      );
      setMealResults(filteredMeals);
    } else {
      setMealResults(allMeals);
    }
  }, [searchBreakfast, mealSearch, allMeals]);

  // State and logic to fetch previous meals
  const [previousMeals, setPreviousMeals] = useState([]);
  const getPreviousMeals = async () => {
    try {
      const response = await fetch(ServerIp + '/get-food');
      if (response.ok) {
        const data = await response.json();
        setPreviousMeals(data);
      } else {
        console.error('Failed to fetch food history');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    getPreviousMeals();
  }, []);

  const fetchAllMeals = async () => { 
    setLoadingMeals(true);
    try {
      const user = await getUserData();
      const username = user[0]?.knimi || "Failsafe";
      const mealResponse = await SearchMeals(username, ''); // Pass an empty string to fetch all meals
      if (mealResponse.ok) {
        const data = await mealResponse.json();
        console.log('All meals for ',username, data);
        setAllMeals(data);
        setMealResults(data);
      } else {
        console.error('Failed to fetch all meals');
      }
    } catch (error) {
      console.error('Error fetching all meals', error);
    }
    setLoadingMeals(false);
  };

  useEffect(() => {
    fetchAllMeals();
  }, []);

  const saveFoodMeal = async (food) => {
    if (!consumedAmount || isNaN(consumedAmount) || consumedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount in grams.");
      return;
    }
    
    const storedData = await SecureStore.getItemAsync("userData");
    const parsedData = JSON.parse(storedData);
    const uname = parsedData[0]?.knimi;
    const ateria = "breakfast";

    const response = await SaveFood(food, ateria, uname, consumedAmount);

    if (response.ok){
      const result = await response.json();
      console.log(result);
      setModalVisible(false);
      setConsumedAmount('');
      Alert.alert("Success", response.message || "Food saved successfully!");
    }
  };


  const addQuickMeal = async (meal) => {
    try {
      const user = await getUserData();
      const username = user[0]?.knimi || "Failsafe";
  
      // Fetch the original meal details
      const response = await fetch(`${ServerIp}/api/get-meal-details?meal_id=${meal.meal_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch meal details');
      }
      const originalMeal = await response.json();
  
      // Log the original meal details to debug
      console.log('Original meal details:', originalMeal);
  
      // Create a new meal with the same foods
      const newMeal = {
        knimi: username,
        ateria: 'breakfast',
        mealname: `${meal.mealname} (Copy)`,
        food: originalMeal.food_id || null,
        salad: originalMeal.salad_id || null,
        drink: originalMeal.drink_id || null,
        other: originalMeal.other_id || null,
      };
  
      // Log the new meal details to debug
      console.log('New meal details:', newMeal);
  
      const addResponse = await fetch(`${ServerIp}/api/add-meal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMeal),
      });
  
      if (addResponse.ok) {
        const data = await addResponse.json();
        Alert.alert("Success", `Meal "${data.message}" added successfully!`);
        fetchAllMeals(); // Refresh the meal list
      } else {
        const errorData = await addResponse.json();
        Alert.alert("Error", errorData.error || "Failed to add meal.");
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      Alert.alert("Error", "Failed to add meal.");
    }
  };

  const searchMyMeals = async (query) => {
    console.log("Searching meals for: ", query);
    if (!query) return;
    setLoading(true);
    setError('');
  
    try {
      const user = await getUserData();
      const username = user[0]?.knimi || "Failsafe";
      const mealResponse= await SearchMeals(username,mealSearch);
      console.log(mealResponse);
      if (mealResponse.ok) {
        const data = await mealResponse.json();
        setMealResults(data);
      } else {
        setError('No meals found');
        setTimeout(() => setError(''), 5000);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch meal data');
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      {/* Top Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'addFood' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('addFood')}
        >
          <Text style={[styles.tabText, activeTab === 'addFood' && styles.activeTabText]}>
            Add Food
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'createMeal' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('createMeal')}
        >
          <Text style={[styles.tabText, activeTab === 'createMeal' && styles.activeTabText]}>
            Create Meal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render content based on the active tab */}
      {activeTab === 'addFood' && (
        <>
          <Text style={[styles.subHeader, { color: theme.text.color }]}>
            "The more you know, the more you can create. There's no end to imagination in the kitchen." 
          </Text>
          <Text style={[styles.header, { color: theme.text.color }]}>Build Your Breakfast</Text>
          <Searchbar
            placeholder="Search food"
            onChangeText={setSearchBreakfast}
            value={searchBreakfast}
            style={styles.searchBar}
          />

          {/* Show loading indicator */}
          {loading && <ActivityIndicator size={50} color="#ff0" />}

          {/* Show error message if there is one */}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}

          {/* Display the search results */}
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
                  <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.foodImage} />
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
                    Carbohydrates: {item.nutriments?.carbohydrates_100g || 'N/A'} g
                  </Text>
                  <Text style={{ color: theme.text.color }}>
                    Fat: {item.nutriments?.fat_100g || 'N/A'} g
                  </Text>
                  <Text style={{ color: theme.text.color }}>
                    Calories: {item.nutriments?.["energy-kcal"] || 'N/A'} kcal
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            )}
          />

          {/* Modal for showing nutrition info */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {selectedFood ? (
                  <>
                    <Image source={{ uri: selectedFood.image_url || 'https://via.placeholder.com/150' }} style={styles.modalImage} />
                    <Text style={styles.modalText}>
                      Name: {selectedFood.product_name || 'N/A'}
                    </Text>
                    <Text style={styles.modalText}>
                      Brand: {selectedFood.brands || 'N/A'}
                    </Text>
                    <Text style={styles.modalText}>
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

                    <TextInput
                      style={styles.input}
                      placeholder="Enter amount (grams)"
                      keyboardType="numeric"
                      value={consumedAmount}
                      onChangeText={setConsumedAmount}
                    />

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => saveFoodMeal(selectedFood)}
                    >
                      <Text>Save food</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.modalText}>No food selected</Text>
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
        </>
      )}

      {activeTab === 'createMeal' && (
        <>
          <Text style={[styles.header, { color: theme.text.color }]}>My Meals</Text>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.buttonBackgroundColor }]} 
            onPress={() => navigation.navigate('Meals', { selectedMealType: 'breakfast' })}
          >
            <Text style={[styles.buttonText, { color: theme.buttonText.color }]}>Create a new meal</Text>
            <Ionicons name="fast-food" size={24} color={theme.iconColor} style={styles.icon} />
          </TouchableOpacity>

          <Searchbar 
            placeholder='Search my meals'
            onChangeText={setMealSearch}
            value={mealSearch}
            style={[styles.searchBar, {marginBottom: 20}]}
          />

          {/* Show loading indicator */}
          {loadingMeals && <ActivityIndicator size="large" color="#ff0" />}

          {/* Show error message if there is one */}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}

          {/* Display the search results */}
          {mealResults.length === 0 && !loadingMeals ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={50} color={theme.text.color} />
              <Text style={[styles.emptyText, { color: theme.text.color }]}>No meals created yet</Text>
            </View>
          ) : (
            <FlatList
  data={mealResults}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <Animatable.View animation="fadeIn" duration={400}>
      <TouchableOpacity
        style={styles.foodItem}
        onPress={() => {
          console.log("Meal details to be implemented");
          // You can navigate to a detailed view if needed
        }}
      >
        <Text style={{ color: theme.text.color }}>
          {item.mealname || 'No name'}
        </Text>
        <Text style={{ color: theme.text.color }}>
          Ruoka: {item.food_ruokanimi || 'No food'}
        </Text>
        <Text style={{ color: theme.text.color }}>
          Juoma: {item.drink_ruokanimi || 'No drink'}
        </Text>
        <Text style={{ color: theme.text.color }}>
          Salad: {item.salad_ruokanimi || 'No salad'}
        </Text>
        <Text style={{ color: theme.text.color }}>
          Other: {item.other_ruokaname || 'N/A'}
        </Text>
        <Text style={{ color: theme.text.color }}>
          Total calories: {item.food_kalorit + item.salad_kalorit + item.drink_kalorit + item.other_kalorit || 'N/A'} kcal
        </Text>
        
        {/* Updated "+" button to pass the specific meal item */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => addQuickMeal(item)}
        >
          <Ionicons name="add-circle" size={30} color="#4169e1" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animatable.View>
  )}
/>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
  tabBar: { flexDirection: 'row', width: '100%', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: '#f9f9f9' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 16, color: '#888' },
  activeTabText: { color: '#007AFF', fontWeight: 'bold' },
  subHeader: { marginTop: 20, fontSize: 18, textAlign: 'center', marginBottom: 10, fontStyle: 'italic' },
  header: { fontSize: 24, marginTop: 40, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  searchBar: { marginBottom: 20, width: '90%', borderRadius: 20, backgroundColor: '#eaeaea', alignSelf: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 25, borderWidth: 2, borderColor: '#4169e1', width: '90%', alignSelf: 'center', marginVertical: 10 },
  buttonText: { fontSize: 18, fontWeight: '600', marginRight: 10 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center', width: '80%' },
  modalText: { fontSize: 18, marginBottom: 15, textAlign: 'center' },
  foodItem: { borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginVertical: 5, width: '80%', backgroundColor: '#f0f0f0' },
  foodImage: { width: 200, height: 100, marginBottom: 10, borderRadius: 5 },
  modalImage: { width: 200, height: 120, marginBottom: 10, borderRadius: 5 },
  mealItem: { padding: 10, marginVertical: 5, backgroundColor: '#e9e9e9', borderRadius: 5, width: '80%' },
  mealText: { fontSize: 16, color: '#333' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  addButton: { position: 'absolute', right: 10, top: 4 },
});

export default BreakfastScreen;