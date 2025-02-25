import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import ServerIp from '../hooks/Global';

// This is a hook to get calories to not have to repeat the same code in multiple components
const GetCalories = () => {
  const [caloriesData, setCaloriesData] = useState({ goal: 0, food: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalories = async () => {
    try {
      const storedLoginStatus = await SecureStore.getItemAsync('isLoggedIn');
      const storedData = await SecureStore.getItemAsync("userData");
      const parsedData = JSON.parse(storedData);
      if (storedLoginStatus !== 'true') {
        throw new Error('User is not logged in');
      }

      const response = await fetch(ServerIp + '/get-calories',{
        headers: {
          knimi: parsedData[0]?.knimi,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch calories data');
      }

      const data = await response.json();
      setCaloriesData({
        goal: data.goal.toFixed(0),
          food: data.food.toFixed(0),
          remaining: (data.goal - data.food).toFixed(0),
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalories();
  }, []);

  return { caloriesData, loading, error, fetchCalories };
};

export default GetCalories;