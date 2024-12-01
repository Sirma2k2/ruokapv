import { View, Text } from 'react-native'
import React, { useEffect } from 'react'


const storedLoginStatus = await SecureStore.getItemAsync('isLoggedIn');



//this is a hook to get calories
const GetCalories = () => {
useEffect(() => {
    // Fetch calories from the API
    fetch('http://localhost:3000/api/calories')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log('Error fetching calories:', error))
    }, [])


}

export default GetCalories;