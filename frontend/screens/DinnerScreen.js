import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { useTheme } from '../components/ThemeContext'; // Import the useTheme hook
import { ActivityIndicator, Searchbar } from 'react-native-paper';


const DinnerScreen = () => {
  const { theme } = useTheme(); // Access the theme from context
  const [activeTab, setActiveTab] = useState('addFood'); // Track the active tab
  const [searchDinner, setSearchDinner] = useState(''); // State for the search bar
  const [modalVisible, setModalVisible] = useState(false)
  
  const [ foodResults, setFoodResults] = useState([])
  const [ loading, setLoading] = useState(false)
  const [ error, setError] = useState(false)

  const searchFood = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/api/searchFood?query=${query}`);
      if (response.ok) {
        const data = await response.json();
        setFoodResults(data);
      } else {
        setError('No products found');
      }
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch food data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchDinner.length > 2) {
      searchFood(searchDinner);
    } else {
      setFoodResults([]);
    }
  }, [searchDinner]);


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
          <Text style={[styles.header, { color: theme.text.color }]}>Build Your Dinner</Text>
          <Searchbar
            placeholder="Search food"
            onChangeText={setSearchDinner}
            value={searchDinner}
          />
          <TouchableOpacity
            style={styles.openModalButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>show nutritions </Text>
          </TouchableOpacity>

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>...</Text>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Save food</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          { /*show loading indicator*/}
          {loading && <ActivityIndicator size="large" color="#ff0"/> } 
          {/* Show error message if there is one */}
          {error && <Text style={{color: 'red'}}>{error}</Text>}

          { /*display the search results*/}
          <FlatList
          data={foodResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item}) => (
            <View style={styles.foodItem}>
              <Text style={{ color:theme.text.color}}>
                {item.product_name || 'No name'}
              </Text>
              <Text style={{ color:theme.text.color}}>
                {item.brands || 'No brand'}
              </Text>
              <Text style={{ color:theme.text.color}}>
                Määrä: {item.quantity || 'N/A' }
              </Text>
              <Text style={{ color:theme.text.color}}>
                Proteiini:{item.nutriments?.proteins_100g || 'N/A' } g
              </Text>
              <Text style={{color:theme.text.color}}>
                Hiilihydraatit: {item.nutriments?.carbohydrates_100g || 'N/A'} g
              </Text>
              <Text style={{color:theme.text.color}} >
                Rasva: {item.nutriments?.fat_100g || 'N/A'} g
              </Text>
              <Text style={{color:theme.text.color}} >
               Kalorit: {item.nutriments?.["energy-kcal_100g"] || 'N/A'} g
              </Text>
              </View>
          )}
          />
        </>
      )}

      {activeTab === 'createMeal' && (
        <>
          <Text style={[styles.header, { color: theme.text.color }]}>Create Your Meal</Text>
          {/* Add form or UI for creating a meal */}
          <Text style={{ color: theme.text.color }}>Form or UI for creating a meal goes here</Text>
        </>
      )}
    </View>
  );
};

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
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 20,
    width: '90%',
  },
  openModalButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  }
})

export default DinnerScreen;
