import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../components/ThemeContext'; 
import { ActivityIndicator, Searchbar } from 'react-native-paper';

const LunchScreen = () => {
  const { theme } = useTheme(); // Access the theme from context
  const [activeTab, setActiveTab] = useState('addFood'); // Track the active tab
  const [searchLunch, setSearchLunch] = useState(''); // State for the search bar
  const [foodResults, setFoodResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')



  const searchFood = async (query) => {
    if (!query) return
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:3000/api/searchFood?query=${query}`)

      if (response.ok) {
        const data = await response.json()
        setFoodResults(data)
      } else {
        setError('No products found')
      }
      setLoading(false)
    } catch (error) {
      setError('Failed to fetch food data')
      setLoading(false)
    }
  }
  useEffect(() => {
    if (searchLunch.length > 2) {
      searchFood(searchLunch)
    } else {
      setFoodResults([])
    }
  }, [searchLunch])


  const [previousMeals, setPreviousMeals] = useState([]);

  const getPreviousMeals = async () => {
    try {
      const response = await fetch('http://localhost:3000/get-food');
      if (response.ok) {
        const data = await response.json();
        setPreviousMeals(data);
      } else {
        console.error('Failed to fetch food history');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  // Fetch previous meals when the component mounts
  useEffect(() => {
    getPreviousMeals();
  }, []);

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
          <Text style={[styles.header, { color: theme.text.color }]}>Build Your Lunch</Text>
          <Searchbar
            placeholder="Search food"
            onChangeText={setSearchLunch}
            value={searchLunch}
          />
          
          {/* Show loading indicator */}
          {loading && <ActivityIndicator size="large" color="#ff0" />}

          {/* Show error message if there is one */}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}

          {/* Display the search results */}
          <FlatList
          data={foodResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
              <View style={styles.foodItem}>
                <Text style={{ color: theme.text.color }}>
                  {item.product_name || 'No name'}
                </Text>
                <Text style={{ color: theme.text.color }}>
                  {item.brands || 'No brand'}
                </Text>
                <Text style={{ color: theme.text.color }}>
                  Quantity: {item.quantity || 'N/A'}
                </Text>
              </View>
            )}
          />
        </>
      )}





      {activeTab === 'createMeal' && (
        <>

          <Text style={[styles.header, { color: theme.text.color }]}>Create Your Meal</Text>
          {/* Add your form or additional UI for meal creation here */}
          
          <FlatList
          data={previousMeals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.mealItem}>
              <Text style={styles.mealText}>{item.name}</Text>
            </View>
          )}
          >

          </FlatList>

        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center' 
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
  foodItem: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '80%',
    backgroundColor: '#f0f0f0',
  }
});

export default LunchScreen;
